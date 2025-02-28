function gerarMapa(lojaLat, lojaLon, quadrantes) {
    let script = `
        var map = L.map('map').setView([${lojaLat}, ${lojaLon}], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
        }).addTo(map);

        // Adicionar marcador da loja
        L.circle([${lojaLat}, ${lojaLon}], {radius: 1000, fillOpacity: 0,
}).addTo(map);
        L.circle([${lojaLat}, ${lojaLon}], {radius: 2000, fillOpacity: 0,
}).addTo(map);
        L.circle([${lojaLat}, ${lojaLon}], {radius: 3000, fillOpacity: 0,
}).addTo(map);
        L.circle([${lojaLat}, ${lojaLon}], {radius: 4000, fillOpacity: 0,
}).addTo(map);
        L.circle([${lojaLat}, ${lojaLon}], {radius: 5000, fillOpacity: 0,
}).addTo(map);

        L.marker([${lojaLat}, ${lojaLon}], {
            icon: L.icon({
                iconUrl: '/icons/azilas-pin.png',
                iconSize: [25, 40], 
            })
        }).addTo(map).bindPopup("Azilados");

        // Adicionar legenda com barra de escala
        var legend = L.control({ position: "topright" });
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
                    html: '<div class=quadInfo><p>R$${quadrante.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}, QTD: ${quadrante.numeroOcorrencias}, TM: R$${(quadrante.valorTotal / quadrante.numeroOcorrencias).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>',
                    iconSize: [25, 30],
                })
            }).addTo(map);
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
