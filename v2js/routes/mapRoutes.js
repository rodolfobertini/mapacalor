const express = require('express');
const { getSalesData } = require('../services/mapService'); // Importar o serviço do mapa

const router = express.Router();

// Rota principal para gerar os dados do mapa
router.get('/', async (req, res) => {
    try {
        // Obter parâmetros da query string
        const { startDate, endDate, ven_nrloja, ven_status } = req.query;

        // Validar os parâmetros obrigatórios
        if (!startDate || !endDate || !ven_nrloja || !ven_status) {
            return res.status(400).json({ 
                error: 'Os parâmetros startDate, endDate, ven_nrloja e ven_status são obrigatórios.' 
            });
        }

        // Chamar a função que consulta o banco de dados
        const data = await getSalesData(startDate, endDate, ven_nrloja, ven_status);

        // Retornar os dados em formato JSON
        res.json(data);
    } catch (err) {
        console.error('Erro ao obter dados do mapa:', err);
        res.status(500).json({ error: 'Erro ao obter dados do mapa.' });
    }
});

module.exports = router;
