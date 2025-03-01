const { gerarHtmlBasico } = require('./gerarHtmlBasico');
const { gerarMenu } = require('./gerarMenu');
const { gerarMapa } = require('./gerarMapa');
const { gerarRodape } = require('./gerarRodape');

function gerarMapaPage(lojaLat, lojaLon, quadrantes, ven_nrloja, gridSize, valorMinimo, startDate, endDate, menuPosition) {

    if (menuPosition === 'top') {
        const conteudo = `
        <div>
            <div class="menuTop">
                    ${gerarMenu(ven_nrloja, gridSize, valorMinimo, startDate, endDate)}
            </div>
            <div class="mapaTop">
                    ${gerarMapa(lojaLat, lojaLon, quadrantes)}
            </div>
            ${gerarRodape()}
        </div>
    `;
    const styleExtra = '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"/><script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"></script>';
    return gerarHtmlBasico('Mapa de Calor', conteudo, styleExtra);
    } 
    else {
        const conteudo = `
        <div>
            <div class="menuLeft">
                    ${gerarMenu(ven_nrloja, gridSize, valorMinimo, startDate, endDate)}
            </div>
            <div class="mapaLeft">
                    ${gerarMapa(lojaLat, lojaLon, quadrantes)}
            </div>
            ${gerarRodape()}
        </div>
    `;
    const styleExtra = '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"/><script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"></script>';
    return gerarHtmlBasico('Mapa de Calor', conteudo, styleExtra);
    }
};

module.exports = { gerarMapaPage };
