 /**
 * Gera um card com estatísticas de vendas
 * @param {Object[]} data - Array de dados de vendas
 * @returns {string} HTML do card de estatísticas
 */
function gerarEstatisticasCard(data) {
    // Calcular estatísticas
    const valorTotal = data.reduce((acc, curr) => acc + Number(curr.sum_ven_vlrnot), 0);
    const numeroVendas = data.reduce((acc, curr) => acc + Number(curr.count_ven_vlrnot), 0);
    const ticketMedio = numeroVendas > 0 ? valorTotal / numeroVendas : 0;

    // Formatar valores
    const formatarValor = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const formatarNumero = (numero) => {
        return new Intl.NumberFormat('pt-BR').format(numero);
    };

    return `
        <div class="estatisticas-card">
            <div class="estatisticas-header">
                <h3>Estatísticas do Período</h3>
            </div>
            <div class="estatisticas-body">
                <div class="estatistica-item">
                    <div class="estatistica-icon">💰</div>
                    <div class="estatistica-info">
                        <span class="estatistica-label">Valor Total</span>
                        <span class="estatistica-valor">${formatarValor(valorTotal)}</span>
                    </div>
                </div>
                <div class="estatistica-item">
                    <div class="estatistica-icon">📊</div>
                    <div class="estatistica-info">
                        <span class="estatistica-label">Número de Vendas</span>
                        <span class="estatistica-valor">${formatarNumero(numeroVendas)}</span>
                    </div>
                </div>
                <div class="estatistica-item">
                    <div class="estatistica-icon">🎯</div>
                    <div class="estatistica-info">
                        <span class="estatistica-label">Ticket Médio</span>
                        <span class="estatistica-valor">${formatarValor(ticketMedio)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

module.exports = { gerarEstatisticasCard };