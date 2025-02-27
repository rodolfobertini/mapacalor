const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mapRoutes = require('./routes/mapRoutes');
const path = require('path');
const { gerarLoginPage, gerarErroLoginPage } = require('./components/loginComponent');

const app = express();
const PORT = 3000;

// Configurar middleware de sessão
app.use(session({
    secret: 'seuSegredoAqui',
    resave: false,
    saveUninitialized: true,
}));

// Configurar middleware de body-parser
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

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

module.exports = app;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
