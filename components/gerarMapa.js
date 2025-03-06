function gerarMapa(lojaLat, lojaLon, quadrantes) {
    let script = `
        var map = L.map('map', {
            zoomSnap: 0.5,       // Permite zooms intermediários (ex: 13.0, 13.5, 14.0)    
            zoomDelta: 0.5       // Altera o zoom em passos de 0.5 a cada interação
}).setView([${lojaLat}, ${lojaLon}], 13.5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
    minZoom: 13,
    maxZoom: 18
}).addTo(map);

        // Adicionar marcador da loja
        L.circle([${lojaLat}, ${lojaLon}], {radius: 1000, fillOpacity: 0}).addTo(map);
        L.circle([${lojaLat}, ${lojaLon}], {radius: 2000, fillOpacity: 0}).addTo(map);
        L.circle([${lojaLat}, ${lojaLon}], {radius: 3000, fillOpacity: 0}).addTo(map);
        L.circle([${lojaLat}, ${lojaLon}], {radius: 4000, fillOpacity: 0}).addTo(map);
        L.circle([${lojaLat}, ${lojaLon}], {radius: 5000, fillOpacity: 0}).addTo(map);

        L.marker([${lojaLat}, ${lojaLon}], {
            icon: L.icon({
                iconUrl: '/icons/azilas-pin.png',
                iconSize: [25, 40],
                iconAnchor: [12.5, 40],
             })
        }).addTo(map).bindPopup("Azilados");

        // Adicionar legenda com barra de escala
        var legend = L.control({ position: "bottomleft" });
        legend.onAdd = function () {
            var div = L.DomUtil.create("div", "info legend");
            div.innerHTML += '<div class="legend-bar" style="width: 200px; margin-bottom: 5px;"></div>';
            div.innerHTML += '<span style="float: left;">Menor</span> <span style="float: right;">Maior</span>';
            return div;
        };
        legend.addTo(map);

        // Adicionar quadrantes com cores e valores centrais
    `;

    quadrantes.forEach((quadrante) => {
        script += `
            var bounds = [[${quadrante.lat1}, ${quadrante.lon1}], [${quadrante.lat3}, ${quadrante.lon3}]];
            L.rectangle(bounds, {
                color: '${quadrante.cor}',
                weight: 1,
                fillOpacity: 0.6,
                fillColor: '${quadrante.cor}'
            }).addTo(map);

            var divIcon = L.divIcon({
                className: 'custom-icon',
                html: '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">R$${quadrante.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<br>Qtd ${quadrante.numeroOcorrencias}<br>TM: R$${(quadrante.valorTotal / quadrante.numeroOcorrencias).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>',
                iconSize: [Math.abs(${quadrante.lat1} - ${quadrante.lat3}) * 10000, Math.abs(${quadrante.lon1} - ${quadrante.lon3}) * 10000]
            });

            L.marker([((${quadrante.lat1} + ${quadrante.lat3}) / 2), ((${quadrante.lon1} + ${quadrante.lon3}) / 2)], { icon: divIcon }).addTo(map);
        `;
    });

    return `
    <div id="map" class="map">
    <script>
    ${script}
    </script>
    </div>`;
}

module.exports = { gerarMapa };
