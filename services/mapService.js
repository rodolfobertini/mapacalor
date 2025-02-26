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
 * @param {string} startDate
 * @param {string} endDate
 * @param {number} ven_nrloja
 * @param {number} ven_status
 * @returns {Promise<Object[]>}
 */
async function getSalesData(startDate, endDate, ven_nrloja, ven_status) {
    const query = `
        SELECT 
            REPLACE(VEN_LATI, ',', '.')::DOUBLE PRECISION AS ven_lati,
            REPLACE(VEN_LONG, ',', '.')::DOUBLE PRECISION AS ven_long,
            SUM(VEN_VLRNOT) AS ven_vlrnot
        FROM TB_MOVVENDA
        WHERE 
            VEN_NRLOJA = $1 
            AND VEN_STATUS = $2 
            AND VEN_TPVEND = 2 
            AND VEN_LATI IS NOT NULL 
            AND VEN_LATI <> '0' 
            AND VEN_DHMOVI >= $3 
            AND VEN_DHMOVI <= $4
        GROUP BY 
            REPLACE(VEN_LATI, ',', '.')::DOUBLE PRECISION,
            REPLACE(VEN_LONG, ',', '.')::DOUBLE PRECISION
        ORDER BY ven_vlrnot DESC;
    `;

    const values = [ven_nrloja, ven_status, startDate, endDate];

    try {
        const result = await pool.query(query, values);
        return result.rows; // Retorna os resultados como um array de objetos JSON
    } catch (err) {
        console.error('Erro ao executar a consulta:', err.message);
        throw new Error('Erro ao consultar dados de vendas');
    }
}

module.exports = { getSalesData };
