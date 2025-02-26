require('dotenv').config(); // Carregar variáveis de ambiente do arquivo .env
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const mapRoutes = require('./routes/mapRoutes');

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

// Middleware de autenticação
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// Rota de login
app.get('/login', (req, res) => {
    res.send(`
        <form method="POST" action="/login">
            <label>Usuário: <input type="text" name="username"></label><br>
            <label>Senha: <input type="password" name="password"></label><br>
            <button type="submit">Login</button>
        </form>
    `);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Verificar credenciais (substitua pela lógica de autenticação real)
    if (username === 'admin' && password === 'admin') {
        req.session.user = username;
        res.redirect('/map');
    } else {
        res.send('Credenciais inválidas');
    }
});

// Rota de logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Proteger a rota do mapa
app.use('/map', isAuthenticated, mapRoutes);

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
