require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Acessorio = require('./models/Acessorio');

const acessoriosIniciais = [
  {
    esporte: 'Ciclismo',
    marca: 'Giro',
    modelo: 'Capacete Foray MIPS Road',
    preco: 429.90,
    foto: 'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=500&auto=format&fit=crop',
  },
  {
    esporte: 'Natação',
    marca: 'Speedo',
    modelo: 'Óculos Hydrotech Mirror Antiembaçante',
    preco: 149.90,
    foto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop',
  },
  {
    esporte: 'Futebol',
    marca: 'Penalty',
    modelo: 'Luva de Goleiro Delta Pro Edição Ouro',
    preco: 219.90,
    foto: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&auto=format&fit=crop',
  },
  {
    esporte: 'Basquete',
    marca: 'Spalding',
    modelo: 'Bola Precision TF-1000 Indoor',
    preco: 389.00,
    foto: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=500&auto=format&fit=crop',
  },
  {
    esporte: 'Corrida',
    marca: 'Garmin',
    modelo: 'Cinto de Hidratação AirFlow Pro',
    preco: 189.90,
    foto: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=500&auto=format&fit=crop',
  },
  {
    esporte: 'Tênis',
    marca: 'Wilson',
    modelo: 'Raquete Pro Staff 97 v14',
    preco: 1450.00,
    foto: 'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=500&auto=format&fit=crop',
  }
];

async function popularBanco() {
  try {
    console.log('[SEED] Conectando ao MongoDB...');
    await connectDB();

    const contagemAtual = await Acessorio.countDocuments();
    if (contagemAtual > 0) {
      console.log(`[SEED] O banco já possui ${contagemAtual} registros. Não é necessário sobrescrever.`);
    } else {
      console.log('[SEED] Inserindo dados iniciais demonstrativos...');
      await Acessorio.insertMany(acessoriosIniciais);
      console.log('[SEED] 6 acessórios demonstrativos inseridos com sucesso!');
    }
  } catch (error) {
    console.error('[SEED ERRO]:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('[SEED] Finalizado.');
  }
}

popularBanco();
