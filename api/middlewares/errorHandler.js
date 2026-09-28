/**
 * Middleware centralizado de tratamento de erros da aplicação.
 * Garante respostas JSON consistentes e previne vazamento de dados sensíveis.
 */
function errorHandler(err, req, res, next) {
  console.error('[ERRO INTERNO]:', err.message || err);

  // Erros de validação do Mongoose
  if (err.name === 'ValidationError') {
    const detalhes = Object.values(err.errors).map((item) => item.message);
    return res.status(400).json({
      erro: 'Falha na validação dos dados.',
      detalhes,
    });
  }

  // Erro de Cast do Mongoose (ex: ObjectId malformado não capturado antes)
  if (err.name === 'CastError') {
    return res.status(400).json({
      erro: `Valor inválido para o campo '${err.path}'.`,
      detalhes: [`O formato fornecido não é compatível com o tipo esperado.`],
    });
  }

  // Erro de JSON malformado no corpo da requisição
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      erro: 'JSON malformado no corpo da requisição.',
      detalhes: ['Verifique a sintaxe do JSON enviado.'],
    });
  }

  // Erro padrão para exceções não tratadas (500)
  return res.status(err.statusCode || 500).json({
    erro: err.userMessage || 'Ocorreu um erro interno no servidor.',
    detalhes: process.env.NODE_ENV === 'development' ? [err.message] : [],
  });
}

module.exports = errorHandler;
