require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log('[SISTEMA] Conectando ao MongoDB Atlas...');
    await connectDB();
    console.log('[SISTEMA] Conexão com MongoDB estabelecida com sucesso.');

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(` Servidor rodando com sucesso!`);
      console.log(` Frontend: http://localhost:${PORT}`);
      console.log(` API URL:  http://localhost:${PORT}/api/acessorios`);
      console.log(` Health:   http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('[ERRO CRÍTICO] Falha ao iniciar servidor:', error.message);
    process.exit(1);
  }
}

startServer();
