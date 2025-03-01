import { gerarHtmlBasico } from './htmlComponent';

function gerarHomePage() {
    const conteudo = `
        <div class="container">
            <h1>Bem-vindo ao Mapa de Calor</h1>
            <p>Este projeto permite visualizar dados de vendas em um mapa de calor interativo.</p>
            <a href="/map">Ir para o Mapa</a>
        </div>
    `;
    return gerarHtmlBasico('Home - Mapa de Calor', conteudo);
}

export { gerarHomePage };
