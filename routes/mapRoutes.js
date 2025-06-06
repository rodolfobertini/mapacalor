const express = require('express');
const path = require('path');
const { getSalesData } = require('../services/mapService');
const { deslocarCoordenadas, gerarEscalaDeCores } = require('../utils/mapUtils');
const { gerarMapaPage } = require('../components/gerarMapaPage');
const { gerarQuadrantes } = require('../components/gerarQuadrantes');
const router = express.Router();

// Servir arquivos estáticos da pasta 'public'
router.use(express.static(path.join(__dirname, '../public')));

// Função para calcular as datas padrão (últimos 30 dias)
function obterIntervaloDatas() {
    const hoje = new Date();
    const dataFinal = hoje.toISOString().split('T')[0]; // Data final no formato YYYY-MM-DD
    const dataInicial = new Date(hoje.setDate(hoje.getDate() - 7)).toISOString().split('T')[0]; // Últimos 30 dias
    return { dataInicial, dataFinal };
}

// Função para validar parâmetros de entrada
function validarParametros(req) {
    const errors = [];
    const gridSize = req.query.grid_size ? Number(req.query.grid_size) : 1000;
    const valorMinimo = req.query.valor_minimo ? Number(req.query.valor_minimo) : 1;

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
        const ven_status = req.query.ven_status || 0;
        const startDate = req.query.startDate || dataInicial;
        const endDate = req.query.endDate || dataFinal;

        // Obter os dados do banco
        const data = await getSalesData(startDate, endDate, ven_nrloja, ven_status);

        // Configurações iniciais do mapa
        const lojaLat = coordenadasLojas[ven_nrloja].lat;
        const lojaLon = coordenadasLojas[ven_nrloja].lon;

        // Gerar HTML do mapa e formulário interativo
        res.send(gerarMapaPage(lojaLat, lojaLon, data, ven_nrloja, gridSize, valorMinimo, startDate, endDate));
    } catch (err) {
        console.error('Erro ao gerar o mapa:', err);
        res.status(500).send('Erro ao gerar o mapa.');
    }
});

module.exports = router;