const express = require('express');
const path = require('path');
const { getSalesData } = require('../services/mapService'); // Importar o serviço do banco
const { deslocarCoordenadas, gerarEscalaDeCores } = require('../utils/mapUtils'); // Importar funções utilitárias
const router = express.Router();

// Servir arquivos estáticos da pasta 'public'
router.use(express.static(path.join(__dirname, '../public')));

// Função para calcular as datas padrão (últimos 30 dias)
function obterIntervaloDatas() {
    const hoje = new Date();
    const dataFinal = hoje.toISOString().split('T')[0]; // Data final no formato YYYY-MM-DD
    const dataInicial = new Date(hoje.setDate(hoje.getDate() - 30)).toISOString().split('T')[0]; // Últimos 30 dias
    return { dataInicial, dataFinal };
}

// Função para validar parâmetros de entrada
function validarParametros(req) {
    const errors = [];
    const gridSize = req.query.grid_size ? Number(req.query.grid_size) : 450;
    const valorMinimo = req.query.valor_minimo ? Number(req.query.valor_minimo) : 100;

    if (isNaN(gridSize) || gridSize <= 0) {
        errors.push('Grid size inválido');
    }
    if (isNaN(valorMinimo) || valorMinimo < 0) {
        errors.push('Valor mínimo inválido');
    }
    return { errors, gridSize, valorMinimo };
}

// Coordenadas das lojas
const coordenadasLojas = {
    1: { lat: -3.7422788220578767, lon: -38.48681349625016 },
    2: { lat: -3.798297659195391, lon: -38.57096246134512 },
    3: { lat: -3.733668068898177, lon: -38.55432495949867 },
    4: { lat: -3.7954802476885665, lon: -38.500222246003915 },
    5: { lat: -3.876471223169551, lon: -38.461967632509136 }
};

// Rota principal para gerar o mapa
router.get('/', async (req, res) => {
    try {
        const { errors, gridSize, valorMinimo } = validarParametros(req);
        if (errors.length > 0) {
            return res.status(400).send(errors.join(', '));
        }

        // Valores padrão
        const { dataInicial, dataFinal } = obterIntervaloDatas();
        const ven_nrloja = req.query.ven_nrloja || 3;
        const ven_status = req.query.ven_status || 0; // Fixo como padrão
        const startDate = req.query.startDate || dataInicial;
        const endDate = req.query.endDate || dataFinal;

        // Obter os dados do banco
        const data = await getSalesData(startDate, endDate, ven_nrloja, ven_status);

        // Configurações iniciais do mapa
        const lojaLat = coordenadasLojas[ven_nrloja].lat;
        const lojaLon = coordenadasLojas[ven_nrloja].lon;
        let quadrantes = [];

        // Gerar os quadrantes
        for (let i = -Math.floor((10 * 1000) / gridSize); i <= Math.floor((10 * 1000) / gridSize); i++) {
            for (let j = -Math.floor((10 * 1000) / gridSize); j <= Math.floor((10 * 1000) / gridSize); j++) {
                const { lat: lat1, lon: lon1 } = deslocarCoordenadas(lojaLat, lojaLon, i * gridSize, j * gridSize);
                const { lat: lat3, lon: lon3 } = deslocarCoordenadas(lojaLat, lojaLon, (i + 1) * gridSize, (j + 1) * gridSize);

                // Filtrar os dados dentro do quadrante
                const dentroDoQuadrante = data.filter(
                    (row) =>
                        row.ven_lati >= Math.min(lat1, lat3) &&
                        row.ven_lati <= Math.max(lat1, lat3) &&
                        row.ven_long >= Math.min(lon1, lon3) &&
                        row.ven_long <= Math.max(lon1, lon3)
                );

                const valorTotalQuadrante = dentroDoQuadrante.reduce((sum, row) => sum + parseFloat(row.ven_vlrnot || 0), 0);

                if (valorTotalQuadrante > valorMinimo) {
                    quadrantes.push({
                        lat1,
                        lon1,
                        lat3,
                        lon3,
                        centroLat: (lat1 + lat3) / 2,
                        centroLon: (lon1 + lon3) / 2,
                        valorTotal: valorTotalQuadrante,
                    });
                }
            }
        }

        // Ordenar os quadrantes pelo valor total e gerar a escala de cores
        quadrantes.sort((a, b) => a.valorTotal - b.valorTotal);
        const escalaDeCores = gerarEscalaDeCores(quadrantes.length);

        // Atribuir cores aos quadrantes com base na posição ordenada
        quadrantes.forEach((quadrante, index) => {
            quadrante.cor = escalaDeCores[index];
        });

        // Gerar HTML do mapa e formulário interativo
        let html =
            '<!DOCTYPE html><html><head><title>Mapa de Calor</title>' +
            '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"/>' +
            '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"/>' +
            '<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">' +
            '<script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"></script>' +
            '<style>body { font-family: "Roboto", sans-serif; display: flex; } .menu { width: 300px; padding: 10px; display: flex; flex-direction: column; justify-content: space-between; } .map { flex-grow: 1; height: calc(100vh - 20px); } .legend-bar { width: 120%; height: 10px; background: linear-gradient(to right, green , yellow , orange , red); border: 1px solid black; margin-bottom: 10px; } .form-container { display: flex; flex-direction: column; gap: 10px; } .form-container label { display: flex; align-items: center; gap: 10px; font-size: 1.2em; } .footer { text-align: center; margin-top: 20px; }</style>' +
            '</head><body>' +
            '<div class="menu">' +
            '<div>' +
            '<img src="/img/rodolfo.jpg" alt="Foto de Rodolfo Bertini" style="width: 40%; border-radius: 50%; margin-bottom: 20px;">' +
            '<form method="GET" class="form-container">' +
            `<label><i class="fas fa-store"></i> Loja: <select name="ven_nrloja">` +
            `<option value="1" ${ven_nrloja == 1 ? 'selected' : ''}>1. Azilados Cocó</option>` +
            `<option value="2" ${ven_nrloja == 2 ? 'selected' : ''}>2. Azilados Maraponga</option>` +
            `<option value="3" ${ven_nrloja == 3 ? 'selected' : ''}>3. Azilados Bezerra</option>` +
            `<option value="4" ${ven_nrloja == 4 ? 'selected' : ''}>4. Azilados Cidade</option>` +
            `<option value="5" ${ven_nrloja == 5 ? 'selected' : ''}>5. Azilados Eusébio</option>` +
            `</select></label>` +
            `<label><i class="fas fa-th"></i> Grid Size: <input type="number" name="grid_size" value="${gridSize}" min="100" max="3000"></label>` +
            `<label><i class="fas fa-dollar-sign"></i> Valor Mínimo: <input type="number" name="valor_minimo" value="${valorMinimo}"></label>` +
            `<label><i class="fas fa-calendar-alt"></i> Data Inicial: <input type="date" name="startDate" value="${startDate}"></label>` +
            `<label><i class="fas fa-calendar-alt"></i> Data Final: <input type="date" name="endDate" value="${endDate}"></label>` +
            '<button type="submit"><i class="fas fa-sync-alt"></i> Atualizar</button>' +
            '</form>' +
            '</div>' +
            '<div class="footer">Rodolfo Bertini - bertini.org</div>' +
            '</div>' +
            '<div id="map" class="map"></div>' +
            '<script>';

        html += `
          var map = L.map('map').setView([${lojaLat}, ${lojaLon}], 14);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19
          }).addTo(map);

          // Adicionar marcador da loja
          L.marker([${lojaLat}, ${lojaLon}], {
              icon: L.icon({
                  iconUrl: 'https://unpkg.com/leaflet@1.8.0/dist/images/marker-icon.png',
                  iconSize: [12, 20], // Reduzir o tamanho do PIN em 50%
                  iconAnchor: [6, 20],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41]
              })
          }).addTo(map).bindPopup("Azilados Bezerra");

          // Adicionar legenda com barra de escala
          var legend = L.control({ position: "topright" });
          legend.onAdd = function () {
              var div = L.DomUtil.create("div", "info legend");
              div.innerHTML += '<div class="legend-bar" style="width: 200px; margin-bottom: 5px;"></div>';
              div.innerHTML += '<span style="float: left;">Menor Valor</span> <span style="float: right;">Maior Valor</span>';
              return div;
          };
          legend.addTo(map);

          // Adicionar quadrantes com cores e valores centrais
        `;

        quadrantes.forEach((quadrante) => {
            html += `
              L.rectangle([
                  [${quadrante.lat1}, ${quadrante.lon1}],
                  [${quadrante.lat3}, ${quadrante.lon3}]
              ], {
                  color: '${quadrante.cor}',
                  weight: 1,
                  fillOpacity: 0.6,
                  fillColor: '${quadrante.cor}'
              }).addTo(map);

              L.marker([${quadrante.centroLat}, ${quadrante.centroLon}], {
                  icon: L.divIcon({
                      className: 'custom-icon',
                      html: '<div style="text-align:center; font-size:12px; color:black;">R$ ${quadrante.valorTotal.toFixed(
                          2
                      )}</div>',
                      iconSize: [30, 30],
                  })
              }).addTo(map);
            `;
        });

        html += '</script></body></html>';
        res.send(html);
    } catch (err) {
        console.error('Erro ao gerar o mapa:', err);
        res.status(500).send('Erro ao gerar o mapa.');
    }
});

module.exports = router;
