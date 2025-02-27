const { gerarHtmlBasico } = require('./htmlComponent');

function gerarLoginPage() {
    const conteudo = `
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
    `;
    return gerarHtmlBasico('Login - Mapa de Calor', conteudo, '<body class="login-page">');
}

function gerarErroLoginPage() {
    const conteudo = `
        <div class="error-card">
            <h2 class="error-title">Credenciais Inválidas</h2>
            <p>Nome de usuário ou senha incorretos.</p>
            <a href="/login" class="back-button">Tentar Novamente</a>
        </div>
    `;
    return gerarHtmlBasico('Erro de Login', conteudo);
}

module.exports = { gerarLoginPage, gerarErroLoginPage };
