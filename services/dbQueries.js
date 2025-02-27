const { Pool } = require('pg'); // Biblioteca para conexão com PostgreSQL

// Configurar conexão com o banco de dados usando Pooling
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

/**
 * Função de exemplo para obter dados de uma tabela
 * @param {string} tableName
 * @returns {Promise<Object[]>}
 */
async function getDataFromTable(tableName) {
    const query = `SELECT * FROM ${tableName};`;

    try {
        const result = await pool.query(query);
        return result.rows; // Retorna os resultados como um array de objetos JSON
    } catch (err) {
        console.error('Erro ao executar a consulta:', err.message);
        throw new Error('Erro ao consultar dados da tabela');
    }
}

module.exports = { getDataFromTable };
