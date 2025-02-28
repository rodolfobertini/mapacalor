function gerarMapa(lojaLat, lojaLon, quadrantes) {
    let script = `
        var map = L.map('map').setView([${lojaLat}, ${lojaLon}], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
        }).addTo(map);

        // Adicionar marcador da loja
        L.marker([${lojaLat}, ${lojaLon}], {
            icon: L.icon({
                iconUrl: '/icons/azilas-pin.png',
                iconSize: [25, 40], 
                iconAnchor: [6, 20],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        }).addTo(map).bindPopup("Azilados");

        // Adicionar legenda com barra de escala
        var legend = L.control({ position: "topright" });
        legend.onAdd = function () {
            var div = L.DomUtil.create("div", "info legend");
            div.innerHTML += '<div class="legend-bar" style="width: 200px; margin-bottom: 5px;"></div>';
            div.innerHTML += '<span style="float: left;">Menor Valor</span> <span style="float: right;">Maior Valor</span>';
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
                    html: '<div style="text-align:center; font-size:10px; color:black;">R$ ${quadrante.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>',
                    iconSize: [30, 30],
                })
            }).addTo(map);
        `;
    });

    return script;
}

module.exports = { gerarMapa };
