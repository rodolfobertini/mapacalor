const { gerarHtmlBasico } = require('./gerarHtmlBasico');
const { gerarMenu } = require('./gerarMenu');
const { gerarMapa } = require('./gerarMapa');
const { gerarRodape } = require('./gerarRodape');

function gerarMapaPage(lojaLat, lojaLon, quadrantes, ven_nrloja, gridSize, valorMinimo, startDate, endDate) {
    const conteudo = `
            ${gerarMenu(ven_nrloja, gridSize, valorMinimo, startDate, endDate)}
            ${gerarMapa(lojaLat, lojaLon, quadrantes)}
            ${gerarRodape()}
    `;
    const styleExtra = '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"/><script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"></script>';
    return gerarHtmlBasico('Mapa de Calor', conteudo, styleExtra);
}

module.exports = { gerarMapaPage };
