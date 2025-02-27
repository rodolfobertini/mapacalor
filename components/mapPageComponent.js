const { gerarHtmlBasico } = require('./htmlComponent');
const { gerarMenu } = require('./mapMenu');
const { gerarMapa } = require('./mapComponent');
const { gerarRodape } = require('./footerComponent');

function gerarMapaPage(lojaLat, lojaLon, quadrantes, ven_nrloja, gridSize, valorMinimo, startDate, endDate) {
    const conteudo = `
        <div class="menu">
            ${gerarMenu(ven_nrloja, gridSize, valorMinimo, startDate, endDate)}
        </div>
        <div id="map" class="map"></div>
        <script>
            ${gerarMapa(lojaLat, lojaLon, quadrantes)}
        </script>
        ${gerarRodape()}
    `;
    return gerarHtmlBasico('Mapa de Calor', conteudo, '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"/><script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"></script>');
}

module.exports = { gerarMapaPage };
