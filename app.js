const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mapRoutes = require('./routes/mapRoutes');
const path = require('path');
const useragent = require('express-useragent'); // Importar o middleware useragent
const { gerarLoginPage, gerarErroLoginPage } = require('./components/loginComponent');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar middleware de sessão
app.use(session({
    secret: 'seuSegredoAqui',
    resave: false,
    saveUninitialized: true,
}));

// Configurar middleware de body-parser
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// Configurar middleware useragent
app.use(useragent.express());

// Middleware de autenticação
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// Rota de login com formulário melhorado
app.get('/login', (req, res) => {
    res.send(gerarLoginPage());
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const dataHora = new Date().toISOString();
    const ip = req.ip;
    const os = req.useragent.os;
    const browser = req.useragent.browser;
    console.log(`[${dataHora}] Tentativa de login: username=${username}, password=${password}, ip=${ip}, os=${os}, browser=${browser}`);
    // Verificar credenciais (usando admin/admin como exemplo)
    if (username === process.env.MP_LOGIN && password === process.env.MP_SENHA) {
        req.session.user = username;
        res.redirect('/map');
    } else {
        res.send(gerarErroLoginPage());
    }
});

// Rota de logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

 // Proteger a rota do mapa
app.use('/map', isAuthenticated, mapRoutes);

// Rota para a página inicial
app.use('/', isAuthenticated, mapRoutes);

module.exports = app;
