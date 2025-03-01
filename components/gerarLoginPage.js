const { gerarHtmlBasico } = require('./gerarHtmlBasico');
const { gerarRodape } = require('./gerarRodape');

function gerarLoginPage() {
    const conteudo = `
        <div class="card">
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
        </div>
        ${gerarRodape()}
    `;
    return gerarHtmlBasico('Login - Mapa de Calor', conteudo);
}

module.exports = { gerarLoginPage };
