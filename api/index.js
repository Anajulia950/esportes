// Carrega variáveis de ambiente do .env caso existam
require('dotenv').config();

const app = require('./app');

// Exporta o aplicativo Express para ser consumido como Vercel Serverless Function
module.exports = app;
