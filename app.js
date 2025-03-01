const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mapRoutes = require('./routes/mapRoutes');
const authRoutes = require('./routes/authRoutes'); // Importar as rotas de autenticação
const path = require('path');
const useragent = require('express-useragent'); // Importar o middleware useragent
const moment = require('moment-timezone'); // Importar a biblioteca moment-timezone

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar middleware de sessão
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

// Configurar middleware de body-parser
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// Configurar middleware useragent
app.use(useragent.express());

// Usar as rotas de autenticação
app.use(authRoutes.router);

// Proteger a rota do mapa
app.use('/map', mapRoutes);

// Rota para a página inicial
app.use('/', mapRoutes);

module.exports = app;
