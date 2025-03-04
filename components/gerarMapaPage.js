const { gerarHtmlBasico } = require('./gerarHtmlBasico');
const { gerarMenu } = require('./gerarMenu');
const { gerarMapa } = require('./gerarMapa');
const { gerarRodape } = require('./gerarRodape');

function gerarMapaPage(lojaLat, lojaLon, quadrantes, ven_nrloja, gridSize, valorMinimo, startDate, endDate, menuPosition) {
    let conteudo;
    let styleExtra = '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"/><script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"></script>';

    if (menuPosition === 'top') {
        conteudo = `
            <div style="width: 100%;">
                <div style="width: 10%;">
                 <div style="display: flex; flex-direction: columm; ">   
                    ${gerarMenu(ven_nrloja, gridSize, valorMinimo, startDate, endDate)}
                 </div>
                </div>
                <div style="width: 90%;">
                    ${gerarMapa(lojaLat, lojaLon, quadrantes)}
                </div>
            </div>
            ${gerarRodape()}
        `;
    } else {
        conteudo = `
            <div style="display: flex; width: 100%; flex-direction: row; ">
                <div style="width: 15%;">
                 <div style="display: flex; flex-direction: row; ">   
                    ${gerarMenu(ven_nrloja, gridSize, valorMinimo, startDate, endDate)}
                 </div>
                </div>
                <div style="width: 85%;">
                    ${gerarMapa(lojaLat, lojaLon, quadrantes)}
                </div>
            </div>
            ${gerarRodape()}
        `;
    }

    return gerarHtmlBasico('Mapa de Calor', conteudo, styleExtra);
}

module.exports = { gerarMapaPage };