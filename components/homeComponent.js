const { gerarHtmlBasico } = require('./htmlComponent');

function gerarHomePage() {
    const conteudo = `
        <div class="card">
            <div class="card-body">
                <h1 class="card-title">Bem-vindo ao Mapa de Calor</h1>
                <p class="card-text">Este projeto permite visualizar dados de vendas em um mapa de calor interativo.</p>
                <a href="/map" class="btn btn-primary">Ir para o Mapa</a>
            </div>
        </div>
    `;
    return gerarHtmlBasico('Home - Mapa de Calor', conteudo);
}

module.exports = { gerarHomePage };
