const express = require('express');
const mapRoutes = require('./routes/mapRoutes'); // Importar rotas do mapa

const app = express();

// Middleware para JSON (se necessário)
app.use(express.json());

// Registrar rotas
app.use('/map', mapRoutes);

module.exports = app;
