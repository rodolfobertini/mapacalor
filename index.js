require('dotenv').config(); // Carregar variáveis de ambiente do arquivo .env
const app = require('./app'); // Corrigir a importação do módulo app
const moment = require('moment-timezone'); // Importar a biblioteca moment-timezone
const PORT = process.env.PORT || 3000; // Definir o padrão aqui

app.listen(PORT, () => {
    const dataHora = moment().tz('America/Fortaleza').format('DD/MM/YY - HH:mm:ss');
    console.log(`[${dataHora}] Servidor rodando em http://localhost:${PORT}`);
});
