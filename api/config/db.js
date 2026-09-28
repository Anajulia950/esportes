const mongoose = require('mongoose');

// Cache global da conexão para evitar múltiplas conexões em invocações serverless da Vercel
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Conecta ao banco de dados MongoDB utilizando Mongoose,
 * reutilizando conexões ativas entre requisições serverless.
 */
async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('A variável de ambiente MONGODB_URI não está definida.');
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

module.exports = connectDB;
