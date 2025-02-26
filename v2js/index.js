require('dotenv').config(); // Carregar variáveis de ambiente do arquivo .env
const app = require('./app'); // Importar o servidor configurado

// Inicializar o servidor na porta especificada
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
