/**
 * Generates the HTML content for the login error page.
 *
 * This function creates a card with an error message indicating that the
 * provided credentials are invalid. It includes a title, a descriptive
 * message, and a link to retry the login process.
 *
 * @returns {string} The HTML content for the login error page.
 */

const { gerarHtmlBasico } = require('./gerarHtmlBasico');
const { gerarRodape } = require('./gerarRodape');

function gerarErroLoginPage() {
    const conteudo = `
        <div class="card">
            <h2 class="error-title">Credenciais Inválidas</h2>
            <p class="card-text">Nome de usuário ou senha incorretos.</p>
            <a href="/login" class="btn">Tentar Novamente</a>
        </div>
        ${gerarRodape()}

    `;
    return gerarHtmlBasico('Erro de Login', conteudo);
}

module.exports = { gerarErroLoginPage };