function gerarMenu(ven_nrloja, gridSize, valorMinimo, startDate, endDate) {
    return `
        <div class="menu">
            <img src="/img/rodolfo.jpg" alt="Foto de Rodolfo Bertini" style="width: 35px; border-radius: 50%; margin-bottom: 10px;">
            <form method="GET" class="form-container">
                <label><i class="fas fa-store"></i> Loja: <select name="ven_nrloja">
                    <option value="1" ${ven_nrloja == 1 ? 'selected' : ''}>1. Azilados Cocó</option>
                    <option value="2" ${ven_nrloja == 2 ? 'selected' : ''}>2. Azilados Maraponga</option>
                    <option value="3" ${ven_nrloja == 3 ? 'selected' : ''}>3. Azilados Bezerra</option>
                    <option value="4" ${ven_nrloja == 4 ? 'selected' : ''}>4. Azilados Cidade</option>
                    <option value="5" ${ven_nrloja == 5 ? 'selected' : ''}>5. Azilados Eusébio</option>
                </select></label>
                <label><i class="fas fa-th"></i> Tamanho Área: <input type="number" name="grid_size" value="${gridSize}" min="100" max="3000"></label>
                <label><i class="fas fa-dollar-sign"></i> Acima de: <input type="number" name="valor_minimo" value="${valorMinimo}"></label>
                <label><i class="fas fa-calendar-alt"></i> Data Inicial: <input type="date" name="startDate" value="${startDate}"></label>
                <label><i class="fas fa-calendar-alt"></i> Data Final: <input type="date" name="endDate" value="${endDate}"></label>
                <button type="submit"><i class="fas fa-sync-alt"></i> Atualizar</button>
            </form>
        </div>
    `;
}

module.exports = { gerarMenu };
