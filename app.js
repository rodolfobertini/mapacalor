const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mapRoutes = require('./routes/mapRoutes');
const path = require('path');

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
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login - Mapa de Calor</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
            <link rel="stylesheet" href="/css/styles.css">
        </head>
        <body class="login-page">
            <div class="login-container">
                <div class="login-card">
                    <div class="login-header">
                        <h1>Login</h1>
                        <p>Bem-vindo(a) ao Mapa de Calor</p>
                    </div>
                    
                    <form class="login-form" method="POST" action="/login">
                        <div class="input-group">
                            <i class="fas fa-user"></i>
                            <input type="text" id="username" name="username" placeholder="Nome de usuário" required>
                        </div>
                        
                        <div class="input-group">
                            <i class="fas fa-lock"></i>
                            <input type="password" id="password" name="password" placeholder="Senha" required>
                        </div>
                        
                        <button type="submit" class="login-button">Entrar</button>
                    </form>
                    
                    <div class="login-footer">
                        <p>© ${new Date().getFullYear()} - Mapa de Calor - Rodolfo Bertini</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Verificar credenciais (usando admin/admin como exemplo)
    if (username === 'admin' && password === 'admin') {
        req.session.user = username;
        res.redirect('/map');
    } else {
        res.send(`
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Erro de Login</title>
                <link rel="stylesheet" href="/css/styles.css">
            </head>
            <body>
                <div class="error-card">
                    <h2 class="error-title">Credenciais Inválidas</h2>
                    <p>Nome de usuário ou senha incorretos.</p>
                    <a href="/login" class="back-button">Tentar Novamente</a>
                </div>
            </body>
            </html>
        `);
    }
});

// Rota de logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Proteger a rota do mapa
app.use('/map', isAuthenticated, mapRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
