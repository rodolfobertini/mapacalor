const { gerarHtmlBasico } = require('./gerarHtmlBasico');
const { gerarMenu } = require('./gerarMenu');
const { gerarMapa } = require('./gerarMapa');
const { gerarRodape } = require('./gerarRodape');
const { gerarEstatisticasCard } = require('./gerarEstatisticasCard');
const { gerarQuadrantes } = require('./gerarQuadrantes');
const { gerarEscalaDeCores } = require('../utils/mapUtils');

function gerarMapaPage(lojaLat, lojaLon, data, ven_nrloja, gridSize, valorMinimo, startDate, endDate) {
    let conteudo;
    let styleExtra = '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"/><script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"></script>';

    // Gerar quadrantes para o mapa
    const quadrantes = gerarQuadrantes(data, lojaLat, lojaLon, gridSize, valorMinimo);

    // Ordenar os quadrantes pelo valor total e gerar a escala de cores
    quadrantes.sort((a, b) => a.valorTotal - b.valorTotal);
    const escalaDeCores = gerarEscalaDeCores(quadrantes.length);

    // Atribuir cores aos quadrantes com base na posição ordenada
    quadrantes.forEach((quadrante, index) => {
        quadrante.cor = escalaDeCores[index];
    });

    conteudo = `
            ${gerarMenu(ven_nrloja, gridSize, valorMinimo, startDate, endDate)}
            ${gerarEstatisticasCard(data)}
            ${gerarMapa(lojaLat, lojaLon, quadrantes)}
            ${gerarRodape()}
        `;

    return gerarHtmlBasico('Mapa de Calor', conteudo, styleExtra);
}

module.exports = { gerarMapaPage };