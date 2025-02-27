require('dotenv').config(); // Carregar variáveis de ambiente do arquivo .env
import { listen } from './app';
const PORT = process.env.PORT || 3001;

listen(PORT, () => {
    const dataHora = new Date().toISOString();
    console.log(`[${dataHora}] Servidor rodando em http://localhost:${PORT}`);
});
