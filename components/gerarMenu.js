function gerarMenu(ven_nrloja, gridSize, valorMinimo, startDate, endDate) {
    return `
            <div class="menu">
            <form method="GET" class="form-container">
                <label><i class="fas fa-store"></i>Loja:<select name="ven_nrloja">
                    <option value="1" ${ven_nrloja == 1 ? 'selected' : ''}>1.Cocó</option>
                    <option value="2" ${ven_nrloja == 2 ? 'selected' : ''}>2.Maraponga</option>
                    <option value="3" ${ven_nrloja == 3 ? 'selected' : ''}>3.Bezerra</option>
                    <option value="4" ${ven_nrloja == 4 ? 'selected' : ''}>4.Cidade</option>
                    <option value="5" ${ven_nrloja == 5 ? 'selected' : ''}>5.Eusébio</option>
                </select></label>
                <label><i class="fas fa-th"></i>Área:<input type="number" name="grid_size" value="${gridSize}" min="80" max="3000"></label>
                <label><i class="fas fa-dollar-sign"></i>Acima de:<input type="number" name="valor_minimo" value="${valorMinimo}" min="1"></label>
                <label><i class="fas fa-calendar-alt"></i>Inicial:<input type="date" name="startDate" value="${startDate}"></label>
                <label><i class="fas fa-calendar-alt"></i>Final:<input type="date" name="endDate" value="${endDate}"></label>
                <button type="submit"><i class="fas fa-sync-alt"></i> Atualizar</button>
            </form>
            </div>
    `;
}

module.exports = { gerarMenu };
