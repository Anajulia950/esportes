const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Acessorio = require('../models/Acessorio');

/**
 * Health Check e verificação de conectividade com MongoDB
 */
async function healthCheck(req, res, next) {
  try {
    await connectDB();
    const dbState = mongoose.connection.readyState;
    const estados = {
      0: 'desconectado',
      1: 'conectado',
      2: 'conectando',
      3: 'desconectando',
    };

    return res.status(200).json({
      status: 'ok',
      database: estados[dbState] || 'desconhecido',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      status: 'erro',
      database: 'erro_conexao',
      mensagem: error.message,
    });
  }
}

/**
 * GET /api/acessorios
 * Lista todos os acessórios com suporte a filtros
 */
async function listarAcessorios(req, res, next) {
  try {
    await connectDB();

    const { esporte, marca, busca } = req.query;
    const filtro = {};

    if (esporte && typeof esporte === 'string' && esporte.trim() !== '') {
      filtro.esporte = new RegExp(`^${esporte.trim()}$`, 'i');
    }

    if (marca && typeof marca === 'string' && marca.trim() !== '') {
      filtro.marca = new RegExp(`^${marca.trim()}$`, 'i');
    }

    if (busca && typeof busca === 'string' && busca.trim() !== '') {
      const termoBusca = busca.trim();
      filtro.$or = [
        { modelo: { $regex: termoBusca, $options: 'i' } },
        { marca: { $regex: termoBusca, $options: 'i' } },
        { esporte: { $regex: termoBusca, $options: 'i' } },
      ];
    }

    const acessorios = await Acessorio.find(filtro).sort({ createdAt: -1 }).lean();

    return res.status(200).json(acessorios);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/acessorios/:id
 * Busca um acessório específico pelo ObjectId
 */
async function obterAcessorioPorId(req, res, next) {
  try {
    await connectDB();

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        erro: 'Identificador (ID) inválido.',
        detalhes: ['O ID informado não possui o formato compatível com MongoDB ObjectId.'],
      });
    }

    const acessorio = await Acessorio.findById(id).lean();

    if (!acessorio) {
      return res.status(404).json({
        erro: 'Acessório não encontrado.',
        detalhes: [`Nenhum registro encontrado com o identificador '${id}'.`],
      });
    }

    return res.status(200).json(acessorio);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/acessorios
 * Cadastra um novo acessório
 */
async function cadastrarAcessorio(req, res, next) {
  try {
    await connectDB();

    const { esporte, marca, modelo, preco, foto } = req.body;

    // Validações manuais prévias para mensagens imediatas e claras
    const erros = [];

    if (!esporte || typeof esporte !== 'string' || esporte.trim() === '') {
      erros.push("O campo 'esporte' é obrigatório.");
    }
    if (!marca || typeof marca !== 'string' || marca.trim() === '') {
      erros.push("O campo 'marca' é obrigatório.");
    }
    if (!modelo || typeof modelo !== 'string' || modelo.trim() === '') {
      erros.push("O campo 'modelo' é obrigatório.");
    }
    if (preco === undefined || preco === null || preco === '') {
      erros.push("O campo 'preco' é obrigatório.");
    } else {
      const precoNum = Number(preco);
      if (isNaN(precoNum) || !isFinite(precoNum)) {
        erros.push("O campo 'preco' deve ser numérico.");
      } else if (precoNum < 0) {
        erros.push("O campo 'preco' deve ser maior ou igual a zero.");
      }
    }

    if (erros.length > 0) {
      return res.status(400).json({
        erro: 'Falha na validação dos dados.',
        detalhes: erros,
      });
    }

    const novoAcessorio = new Acessorio({
      esporte: esporte.trim(),
      marca: marca.trim(),
      modelo: modelo.trim(),
      preco: Number(preco),
      foto: foto && typeof foto === 'string' ? foto.trim() : '',
    });

    const salvo = await novoAcessorio.save();

    return res.status(201).json({
      mensagem: 'Acessório cadastrado com sucesso.',
      acessorio: salvo,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/acessorios/:id
 * Atualiza um acessório existente
 */
async function atualizarAcessorio(req, res, next) {
  try {
    await connectDB();

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        erro: 'Identificador (ID) inválido.',
        detalhes: ['O ID informado não possui o formato compatível com MongoDB ObjectId.'],
      });
    }

    const { esporte, marca, modelo, preco, foto } = req.body;
    const dadosAtualizacao = {};
    const erros = [];

    if (esporte !== undefined) {
      if (typeof esporte !== 'string' || esporte.trim() === '') {
        erros.push("O campo 'esporte' não pode ser vazio.");
      } else {
        dadosAtualizacao.esporte = esporte.trim();
      }
    }

    if (marca !== undefined) {
      if (typeof marca !== 'string' || marca.trim() === '') {
        erros.push("O campo 'marca' não pode ser vazio.");
      } else {
        dadosAtualizacao.marca = marca.trim();
      }
    }

    if (modelo !== undefined) {
      if (typeof modelo !== 'string' || modelo.trim() === '') {
        erros.push("O campo 'modelo' não pode ser vazio.");
      } else {
        dadosAtualizacao.modelo = modelo.trim();
      }
    }

    if (preco !== undefined) {
      const precoNum = Number(preco);
      if (isNaN(precoNum) || !isFinite(precoNum)) {
        erros.push("O campo 'preco' deve ser numérico.");
      } else if (precoNum < 0) {
        erros.push("O campo 'preco' deve ser maior ou igual a zero.");
      } else {
        dadosAtualizacao.preco = precoNum;
      }
    }

    if (foto !== undefined) {
      dadosAtualizacao.foto = typeof foto === 'string' ? foto.trim() : '';
    }

    if (erros.length > 0) {
      return res.status(400).json({
        erro: 'Falha na validação dos dados de atualização.',
        detalhes: erros,
      });
    }

    const acessorioAtualizado = await Acessorio.findByIdAndUpdate(
      id,
      { $set: dadosAtualizacao },
      { new: true, runValidators: true }
    );

    if (!acessorioAtualizado) {
      return res.status(404).json({
        erro: 'Acessório não encontrado.',
        detalhes: [`Nenhum registro encontrado com o identificador '${id}' para atualização.`],
      });
    }

    return res.status(200).json({
      mensagem: 'Acessório atualizado com sucesso.',
      acessorio: acessorioAtualizado,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/acessorios/:id
 * Remove um acessório da base de dados
 */
async function excluirAcessorio(req, res, next) {
  try {
    await connectDB();

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        erro: 'Identificador (ID) inválido.',
        detalhes: ['O ID informado não possui o formato compatível com MongoDB ObjectId.'],
      });
    }

    const acessorioExcluido = await Acessorio.findByIdAndDelete(id);

    if (!acessorioExcluido) {
      return res.status(404).json({
        erro: 'Acessório não encontrado.',
        detalhes: [`Nenhum registro encontrado com o identificador '${id}' para exclusão.`],
      });
    }

    return res.status(200).json({
      mensagem: 'Acessório excluído com sucesso.',
      id: id,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  healthCheck,
  listarAcessorios,
  obterAcessorioPorId,
  cadastrarAcessorio,
  atualizarAcessorio,
  excluirAcessorio,
};
