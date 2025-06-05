const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mapRoutes = require('./routes/mapRoutes');
const path = require('path');
const useragent = require('express-useragent'); // Importar o middleware useragent
const { gerarLoginPage } = require('./components/gerarLoginPage');
const { gerarErroLoginPage } = require('./components/gerarErroLoginPage'); // Corrigir o caminho de importação
const moment = require('moment-timezone'); // Importar a biblioteca moment-timezone
const { gerarHomePage } = require('./components/gerarHomePage'); // Importar o componente homeComponent

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET, // Certifique-se que é uma string longa e aleatória
    resave: false,
    saveUninitialized: false, // Considere mudar para false se não precisar de sessões para todos os visitantes
    cookie: {
        httpOnly: true, // Protege contra XSS
        secure: process.env.NODE_ENV === 'production', // Usar apenas em HTTPS. Na Vercel, NODE_ENV é 'production'.
        sameSite: 'lax' // Ajuda a proteger contra CSRF, considere 'lax' ou 'strict'
    }
}));

// Configurar middleware de body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Serve arquivos estáticos da pasta 'public'
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
    const dataHora = moment().tz('America/Fortaleza').format('DD/MM/YY - HH:mm:ss');
    const ip = req.ip;
    const os = req.useragent.os;
    const browser = req.useragent.browser;
    console.log(`[${dataHora}] Tentativa de login: username=${username}, password=${password}, ip=${ip}, os=${os}, browser=${browser}`);
    // Verificar credenciais (usando variáveis de ambiente)
    if (username === process.env.MP_LOGIN && password === process.env.MP_SENHA) {
        req.session.user = username;
        res.redirect('/home'); // Redirecionar para a página inicial após o login
    } else {
        res.send(gerarErroLoginPage());
    }
});

// Rota para a página inicial (protegida)
app.get('/home', isAuthenticated, (req, res) => {
    res.send(gerarHomePage());
});

// Rota de logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao destruir a sessão:', err);
        }
        res.redirect('/login');
    });
});

// Proteger a rota do mapa
app.use('/map', isAuthenticated, mapRoutes);

---

### **Ajuste Importante Aqui:** Rota Raiz (/)

Esta parte é crucial para evitar o `404` inicial. Ela garante que quando alguém acessa a URL principal do seu projeto, o servidor saiba como responder, seja redirecionando para a página de login ou para a home (se já autenticado).

```javascript
// Rota principal (raiz /)
app.get('/', (req, res) => {
    if (req.session.user) {
        // Se o usuário estiver autenticado, redirecione para /home
        res.redirect('/home');
    } else {
        // Se não estiver autenticado, redirecione para a página de login
        res.redirect('/login');
    }
});
