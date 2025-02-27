require('dotenv').config(); // Carregar variáveis de ambiente do arquivo .env
const app = require('./app'); // Corrigir a importação do módulo app
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    const dataHora = new Date().toISOString();
    console.log(`[${dataHora}] Servidor rodando em http://localhost:${PORT}`);
});
