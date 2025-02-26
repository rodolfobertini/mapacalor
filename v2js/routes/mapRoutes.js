const express = require('express');
const { getSalesData } = require('../services/mapService'); // Importar o serviço do mapa

// Criar uma instância do roteador
const router = express.Router();

// Rota principal para gerar a página do mapa
router.get('/', async (req, res) => {
    try {
        const { startDate, endDate, ven_nrloja, ven_status } = req.query;

        // Verificar se os parâmetros obrigatórios estão presentes
        if (!startDate || !endDate || !ven_nrloja || !ven_status) {
            return res.status(400).send('Os parâmetros startDate, endDate, ven_nrloja e ven_status são obrigatórios.');
        }

        // Obter os dados do banco de dados
        const data = await getSalesData(startDate, endDate, ven_nrloja, ven_status);

        // Gerar o HTML da página com o mapa
        let html =
            '<!DOCTYPE html><html><head><title>Mapa de Calor</title>' +
            '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"/>' +
            '<script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"></script>' +
            '<script src="https://cdn.jsdelivr.net/npm/leaflet.heat/dist/leaflet-heat.js"></script>' +
            '</head><body><div id="map" style="width: 100%; height: 100vh;"></div>' +
            '<script>';

        html += `
          var map = L.map('map').setView([-3.73367, -38.5543], 14);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19
          }).addTo(map);

          // Adicionar camada de mapa de calor
          var heatData = ${JSON.stringify(
              data.map((row) => [row.ven_lati, row.ven_long, parseFloat(row.ven_vlrnot) || 0])
          )};
          L.heatLayer(heatData, { radius: 25 }).addTo(map);
        `;

        // Adicionar quadrantes com popups
        data.forEach((row) => {
            const valorTotal = parseFloat(row.ven_vlrnot) || 0; // Converte para número ou usa 0 como fallback
            html += `
              L.rectangle([
                  [${row.ven_lati - 0.001}, ${row.ven_long - 0.001}],
                  [${row.ven_lati + 0.001}, ${row.ven_long + 0.001}]
              ], {
                  color: 'blue',
                  weight: 1,
                  fillOpacity: 0.4
              }).addTo(map).bindPopup("Valor Total: R$ ${valorTotal.toFixed(2)}");
            `;
        });

        html += '</script></body></html>';
        res.send(html);
    } catch (err) {
        console.error('Erro ao gerar o mapa:', err);
        res.status(500).send('Erro ao gerar o mapa.');
    }
});

// Exportar o roteador para ser usado no app principal
module.exports = router;
