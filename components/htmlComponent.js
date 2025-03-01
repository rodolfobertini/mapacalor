const { gerarRodape } = require('./footerComponent');

function gerarHtmlBasico(titulo, conteudo, estilosExtras = '') {
    return `
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${titulo}</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
            <link rel="stylesheet" href="/css/styles.css">
            ${estilosExtras}
        </head>
        <body>
            ${conteudo}
            ${gerarRodape()}
        </body>
        </html>
    `;
}

module.exports = { gerarHtmlBasico };
