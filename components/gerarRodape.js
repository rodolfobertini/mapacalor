function gerarRodape() {
    return `
        <div class="footer">
            <a href="https://bertini.org" target="_blank" rel="noopener noreferrer"><p>© ${new Date().getFullYear()} - Mapa de Calor - Rodolfo Bertini - bertini.org</p></a>
        </div>
    `;
};

module.exports = { gerarRodape };
