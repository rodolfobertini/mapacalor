const express = require('express');
const chroma = require('chroma-js'); // Biblioteca para gerar escalas de cores
const { getSalesData } = require('../services/mapService'); // Importar o serviço do banco
const router = express.Router();

// Função para calcular deslocamento geográfico
function deslocarCoordenadas(lat, lon, deslocamentoLat, deslocamentoLon) {
    const R = 6378137; // Raio da Terra em metros
    const novaLat = lat + (deslocamentoLat / R) * (180 / Math.PI);
    const novaLon = lon + (deslocamentoLon / R) * (180 / Math.PI) / Math.cos((lat * Math.PI) / 180);
    return { lat: novaLat, lon: novaLon };
}

// Função para gerar uma escala de cores usando chroma.js
function gerarEscalaDeCores(numQuadrantes) {
    return chroma.scale(['green', 'yellow', 'orange', 'red']).colors(numQuadrantes); // Retorna um array com as cores
}

// Função para calcular as datas padrão (últimos 30 dias)
function obterIntervaloDatas() {
    const hoje = new Date();
    const dataFinal = hoje.toISOString().split('T')[0]; // Data final no formato YYYY-MM-DD
    const dataInicial = new Date(hoje.setDate(hoje.getDate() - 30)).toISOString().split('T')[0]; // Últimos 30 dias
    return { dataInicial, dataFinal };
}

// Rota principal para gerar o mapa
router.get('/', async (req, res) => {
    try {
        // Valores padrão
        const { dataInicial, dataFinal } = obterIntervaloDatas();
        const ven_nrloja = req.query.ven_nrloja || 3;
        const ven_status = req.query.ven_status || 0; // Fixo como padrão
        const grid_size = req.query.grid_size || 450;
        const valor_minimo = req.query.valor_minimo || 100;
        const startDate = req.query.startDate || dataInicial;
        const endDate = req.query.endDate || dataFinal;

        // Obter os dados do banco
        const data = await getSalesData(startDate, endDate, ven_nrloja, ven_status);

        // Configurações iniciais do mapa
        const lojaLat = -3.73367;
        const lojaLon = -38.5543;
        let quadrantes = [];

        // Gerar os quadrantes
        for (let i = -Math.floor((10 * 1000) / grid_size); i <= Math.floor((10 * 1000) / grid_size); i++) {
            for (let j = -Math.floor((10 * 1000) / grid_size); j <= Math.floor((10 * 1000) / grid_size); j++) {
                const { lat: lat1, lon: lon1 } = deslocarCoordenadas(lojaLat, lojaLon, i * grid_size, j * grid_size);
                const { lat: lat3, lon: lon3 } = deslocarCoordenadas(lojaLat, lojaLon, (i + 1) * grid_size, (j + 1) * grid_size);

                // Filtrar os dados dentro do quadrante
                const dentroDoQuadrante = data.filter(
                    (row) =>
                        row.ven_lati >= Math.min(lat1, lat3) &&
                        row.ven_lati <= Math.max(lat1, lat3) &&
                        row.ven_long >= Math.min(lon1, lon3) &&
                        row.ven_long <= Math.max(lon1, lon3)
                );

                const valorTotalQuadrante = dentroDoQuadrante.reduce((sum, row) => sum + parseFloat(row.ven_vlrnot || 0), 0);

                if (valorTotalQuadrante > valor_minimo) {
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
            '<script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"></script>' +
            '<style>.legend-bar { width: 300px; height: 20px; background: linear-gradient(to right, green , yellow , orange , red); border: 1px solid black; margin-bottom: 10px; }</style>' +
            '</head><body>' +
            '<form method="GET" style="margin-bottom:20px;">' +
            `<label>Loja: <select name="ven_nrloja">${[1,2,3,4,5].map(n => `<option value="${n}" ${n == ven_nrloja ? 'selected' : ''}>${n}</option>`).join('')}</select></label>` +
            `<label>Grid Size: <input type="number" name="grid_size" value="${grid_size}" min="100" max="3000"></label>` +
            `<label>Valor Mínimo: <input type="number" name="valor_minimo" value="${valor_minimo}"></label>` +
            `<label>Data Inicial: <input type="date" name="startDate" value="${startDate}"></label>` +
            `<label>Data Final: <input type="date" name="endDate" value="${endDate}"></label>` +
            '<button type="submit">Atualizar</button>' +
            '</form>' +
            '<div id="map" style="width: 100%; height: calc(100vh - 120px);"></div>' +
            '<script>';

        html += `
          var map = L.map('map').setView([${lojaLat}, ${lojaLon}], 14);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19
          }).addTo(map);

          // Adicionar marcador da loja
          L.marker([${lojaLat}, ${lojaLon}]).addTo(map).bindPopup("Azilados Bezerra");

          // Adicionar legenda com barra de escala
          var legend = L.control({ position: "topright" });
          legend.onAdd = function () {
              var div = L.DomUtil.create("div", "info legend");
              div.innerHTML += "<h4>Escala de Cores</h4>";
              div.innerHTML += '<div class="legend-bar"></div>';
              div.innerHTML += '<span>Menor Valor</span> <span style="float:right;">Maior Valor</span>';
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
