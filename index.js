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

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

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
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                
                body {
                    background: linear-gradient(120deg, #3498db, #8e44ad);
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    overflow: hidden;
                }
                
                .login-container {
                    width: 100%;
                    max-width: 400px;
                    padding: 20px;
                }
                
                .login-card {
                    background-color: #fff;
                    border-radius: 10px;
                    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2);
                    padding: 40px;
                    width: 100%;
                }
                
                .login-header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                
                .login-header h1 {
                    color: #333;
                    margin-bottom: 10px;
                }
                
                .login-header p {
                    color: #777;
                }
                
                .login-form {
                    margin-bottom: 20px;
                }
                
                .input-group {
                    position: relative;
                    margin-bottom: 20px;
                }
                
                .input-group i {
                    position: absolute;
                    left: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #888;
                }
                
                .input-group input {
                    width: 100%;
                    padding: 15px;
                    padding-left: 45px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    font-size: 16px;
                    outline: none;
                    transition: border-color 0.3s ease;
                }
                
                .input-group input:focus {
                    border-color: #3498db;
                }
                
                .login-button {
                    width: 100%;
                    padding: 15px;
                    background: linear-gradient(to right, #3498db, #2980b9);
                    border: none;
                    border-radius: 5px;
                    color: #fff;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.3s ease;
                }
                
                .login-button:hover {
                    background: linear-gradient(to right, #2980b9, #1c6da6);
                }
                
                .login-footer {
                    text-align: center;
                    margin-top: 20px;
                    color: #777;
                    font-size: 14px;
                }

                @media (max-width: 480px) {
                    .login-card {
                        padding: 30px 20px;
                    }
                }
            </style>
        </head>
        <body>
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
    console.log(`Login attempt with username: ${username} and password: ${password}`);
    // Verificar credenciais (substitua pela lógica de autenticação real)
    if (username === process.env.MP_LOGIN && password === process.env.MP_SENHA) {
        req.session.user = username;
        res.redirect('/map');
    } else {
        console.log('Invalid credentials');
        res.send(`
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Erro de Login</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background: linear-gradient(120deg, #3498db, #8e44ad);
                        height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        text-align: center;
                    }
                    .error-card {
                        background-color: #fff;
                        border-radius: 10px;
                        box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2);
                        padding: 40px;
                        max-width: 400px;
                    }
                    .error-title {
                        color: #e74c3c;
                        margin-bottom: 20px;
                    }
                    .back-button {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 10px 20px;
                        background-color: #3498db;
                        color: white;
                        text-decoration: none;
                        border-radius: 5px;
                        transition: background-color 0.3s;
                    }
                    .back-button:hover {
                        background-color: #2980b9;
                    }
                </style>
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
