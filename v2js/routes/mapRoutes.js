const express = require('express');
const { getSalesData } = require('../services/mapService'); // Importar o serviço do banco
const router = express.Router();

// Função para calcular deslocamento geográfico
function deslocarCoordenadas(lat, lon, deslocamentoLat, deslocamentoLon) {
    const R = 6378137; // Raio da Terra em metros
    const novaLat = lat + (deslocamentoLat / R) * (180 / Math.PI);
    const novaLon = lon + (deslocamentoLon / R) * (180 / Math.PI) / Math.cos((lat * Math.PI) / 180);
    return { lat: novaLat, lon: novaLon };
}

// Função para gerar uma escala de cores proporcional ao número de quadrantes
function gerarEscalaDeCores(numQuadrantes) {
    const gradiente = [];
    for (let i = 0; i < numQuadrantes; i++) {
        const proporcao = i / (numQuadrantes - 1); // Normaliza entre 0 e 1
        const r = Math.floor(255 * proporcao); // Vermelho aumenta com a proporção
        const g = Math.floor(255 * (1 - proporcao)); // Verde diminui com a proporção
        const b = 0; // Azul é sempre 0 para criar o degradê verde → vermelho
        gradiente.push(`rgb(${r},${g},${b})`);
    }
    return gradiente;
}

// Rota principal para gerar o mapa
router.get('/', async (req, res) => {
    try {
        const { startDate, endDate, ven_nrloja, ven_status, grid_size = 250, valor_minimo = 100 } = req.query;

        if (!startDate || !endDate || !ven_nrloja || !ven_status) {
            return res.status(400).send('Os parâmetros startDate, endDate, ven_nrloja e ven_status são obrigatórios.');
        }

        // Obter os dados do banco
        const data = await getSalesData(startDate, endDate, ven_nrloja, ven_status);

        // Configurações iniciais
        const lojaLat = -3.73367;
        const lojaLon = -38.5543;
        const areaKm = 10; // Extensão da área (10 km)
        let quadrantes = [];

        // Gerar os quadrantes
        for (let i = -Math.floor((areaKm * 1000) / grid_size); i <= Math.floor((areaKm * 1000) / grid_size); i++) {
            for (let j = -Math.floor((areaKm * 1000) / grid_size); j <= Math.floor((areaKm * 1000) / grid_size); j++) {
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

        // Gerar HTML do mapa
        let html =
            '<!DOCTYPE html><html><head><title>Mapa de Calor</title>' +
            '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"/>' +
            '<script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"></script>' +
            '</head><body><div id="map" style="width: 100%; height: 100vh;"></div>' +
            '<script>';

        html += `
          var map = L.map('map').setView([${lojaLat}, ${lojaLon}], 14);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19
          }).addTo(map);

          // Adicionar marcador da loja
          L.marker([${lojaLat}, ${lojaLon}]).addTo(map).bindPopup("Azilados Bezerra");

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
