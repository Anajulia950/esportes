/**
 * Middleware personalizado de CORS para compatibilidade total
 * entre desenvolvimento local e produção na Vercel.
 */
function corsMiddleware(req, res, next) {
  const allowedOrigin = process.env.CORS_ORIGIN || '*';
  
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Max-Age', '86400');

  // Trata requisições preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
}

module.exports = corsMiddleware;
