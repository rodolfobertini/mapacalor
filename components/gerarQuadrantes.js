const { deslocarCoordenadas } = require('../utils/mapUtils');

function gerarQuadrantes(data, lojaLat, lojaLon, gridSize, valorMinimo) {
    let quadrantes = [];

    for (let i = -Math.floor((10 * 1000) / gridSize); i <= Math.floor((10 * 1000) / gridSize); i++) {
        for (let j = -Math.floor((10 * 1000) / gridSize); j <= Math.floor((10 * 1000) / gridSize); j++) {
            const { lat: lat1, lon: lon1 } = deslocarCoordenadas(lojaLat, lojaLon, i * gridSize, j * gridSize);
            const { lat: lat3, lon: lon3 } = deslocarCoordenadas(lojaLat, lojaLon, (i + 1) * gridSize, (j + 1) * gridSize);

            // Filtrar os dados dentro do quadrante
            const dentroDoQuadrante = data.filter(
                (row) =>
                    row.ven_lati >= Math.min(lat1, lat3) &&
                    row.ven_lati <= Math.max(lat1, lat3) &&
                    row.ven_long >= Math.min(lon1, lon3) &&
                    row.ven_long <= Math.max(lon1, lon3)
            );

            const valorTotalQuadrante = dentroDoQuadrante.reduce((sum, row) => sum + parseFloat(row.sum_ven_vlrnot || 0), 0);
            const numeroOcorrenciasQuadrante = dentroDoQuadrante.reduce((sum, row) => sum + parseInt(row.count_ven_vlrnot || 0), 0);

            if (valorTotalQuadrante > valorMinimo) {
                quadrantes.push({
                    lat1,
                    lon1,
                    lat3,
                    lon3,
                    centroLat: (lat1 + lat3) / 2,
                    centroLon: (lon1 + lon3) / 2,
                    valorTotal: valorTotalQuadrante,
                    numeroOcorrencias: numeroOcorrenciasQuadrante,
                });
            }
        }
    }

    return quadrantes;
}

module.exports = { gerarQuadrantes };
