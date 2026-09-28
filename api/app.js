const path = require('path');
const express = require('express');
const corsMiddleware = require('./middlewares/cors');
const errorHandler = require('./middlewares/errorHandler');
const acessoriosRoutes = require('./routes/acessorios');
const { healthCheck } = require('./controllers/acessorioController');

const app = express();

// Middlewares essenciais
app.use(corsMiddleware);
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Servir frontend estático quando acessado diretamente pelo Express
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Rotas da API
app.get('/api/health', healthCheck);
app.use('/api/acessorios', acessoriosRoutes);

// Rota raiz opcional: entrega o frontend index.html se acessado via navegador
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Tratamento de rota não encontrada (404) para /api
app.use('/api/*', (req, res) => {
  res.status(404).json({
    erro: 'Rota da API não encontrada.',
    detalhes: [`O endpoint '${req.originalUrl}' não existe nesta API.`],
  });
});

// Middleware centralizado de tratamento de erros
app.use(errorHandler);

module.exports = app;
