require('dotenv').config(); // Carregar variáveis de ambiente do arquivo .env
const app = require('./app');
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
