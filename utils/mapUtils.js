const chroma = require('chroma-js'); // Biblioteca para gerar escalas de cores

// Função para calcular deslocamento geográfico
function deslocarCoordenadas(lat, lon, deslocamentoLat, deslocamentoLon) {
    const R = 6378137; // Raio da Terra em metros
    const novaLat = lat + (deslocamentoLat / R) * (180 / Math.PI);
    const novaLon = lon + (deslocamentoLon / R) * (180 / Math.PI) / Math.cos((lat * Math.PI) / 180);
    return { lat: novaLat, lon: novaLon };
}

// Função para gerar uma escala de cores usando chroma.js
function gerarEscalaDeCores(numQuadrantes) {
    return chroma.scale(['green', 'yellow', 'orange', 'red']).colors(numQuadrantes); // Retorna um array com as cores
}

module.exports = { deslocarCoordenadas, gerarEscalaDeCores };
