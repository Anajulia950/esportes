/**
 * Suite de Testes Automatizados — Sistema de Acessórios para Esportes
 * Executa testes de conexão, validação de modelo, CRUD completo e casos de erro.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../api/config/db');
const Acessorio = require('../api/models/Acessorio');

async function executarTestes() {
  console.log('====================================================');
  console.log('  INICIANDO BATERIA DE TESTES AUTOMATIZADOS');
  console.log('====================================================\n');

  let testesPassados = 0;
  let testesFalhos = 0;

  function asserir(condicao, descricao) {
    if (condicao) {
      console.log(`  [PASSOU] ${descricao}`);
      testesPassados++;
    } else {
      console.error(`  [FALHOU] ${descricao}`);
      testesFalhos++;
    }
  }

  try {
    // 1. Teste de Conexão com MongoDB
    console.log('[1/6] Testando Conexão com o MongoDB Atlas...');
    const conn = await connectDB();
    asserir(conn && mongoose.connection.readyState === 1, 'Conexão ativa com o banco de dados (readyState === 1)');

    // 2. Teste de Validação de Campos Obrigatórios (POST inválido)
    console.log('\n[2/6] Testando Validações de Campos Obrigatórios...');
    try {
      const itemInvalido = new Acessorio({ preco: 'nao-e-numero' });
      await itemInvalido.validate();
      asserir(false, 'Deveria ter rejeitado item sem esporte, marca e modelo.');
    } catch (err) {
      asserir(err.errors.esporte !== undefined, 'Rejeitou documento sem campo obrigatório "esporte"');
      asserir(err.errors.marca !== undefined, 'Rejeitou documento sem campo obrigatório "marca"');
      asserir(err.errors.modelo !== undefined, 'Rejeitou documento sem campo obrigatório "modelo"');
      asserir(err.errors.preco !== undefined, 'Rejeitou preço não numérico');
    }

    // 3. Teste de Criação de Acessório Válido (POST)
    console.log('\n[3/6] Testando Criação de Acessório (POST)...');
    const acessorioTeste = new Acessorio({
      esporte: 'Ciclismo',
      marca: 'Specialized',
      modelo: 'S-Works Prevail 3',
      preco: 1899.90,
      foto: 'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=500',
    });

    const salvo = await acessorioTeste.save();
    asserir(salvo._id !== undefined, 'Acessório salvo com _id gerado');
    asserir(salvo.esporte === 'Ciclismo', 'Campo esporte gravado corretamente');
    asserir(salvo.preco === 1899.90, 'Campo preco numérico gravado corretamente');
    asserir(salvo.createdAt instanceof Date, 'Data createdAt gerenciada automaticamente');

    const idCriado = salvo._id.toString();

    // 4. Teste de Consulta (GET por ID e Lista)
    console.log('\n[4/6] Testando Consultas (GET)...');
    const encontrado = await Acessorio.findById(idCriado).lean();
    asserir(encontrado !== null && encontrado._id.toString() === idCriado, 'Acessório localizado por ID');

    const lista = await Acessorio.find({ esporte: 'Ciclismo' }).lean();
    asserir(Array.isArray(lista) && lista.length > 0, 'Listagem com filtro por esporte retornou registros');

    // 5. Teste de Atualização (PUT)
    console.log('\n[5/6] Testando Atualização de Acessório (PUT)...');
    const atualizado = await Acessorio.findByIdAndUpdate(
      idCriado,
      { $set: { preco: 1749.90, modelo: 'S-Works Prevail 3 LTD' } },
      { new: true, runValidators: true }
    );
    asserir(atualizado.preco === 1749.90, 'Preço atualizado com sucesso');
    asserir(atualizado.modelo === 'S-Works Prevail 3 LTD', 'Modelo atualizado com sucesso');
    asserir(atualizado.updatedAt >= salvo.updatedAt, 'Data updatedAt atualizada automaticamente');

    // 6. Teste de Exclusão (DELETE) e Casos Extremos
    console.log('\n[6/6] Testando Exclusão (DELETE) e IDs Inválidos...');
    const removido = await Acessorio.findByIdAndDelete(idCriado);
    asserir(removido !== null, 'Acessório de teste removido com sucesso');

    const buscaPosExclusao = await Acessorio.findById(idCriado);
    asserir(buscaPosExclusao === null, 'Acessório não existe mais após exclusão (404 esperado)');

    const idInvalido = 'id-totalmente-invalido-123';
    asserir(!mongoose.Types.ObjectId.isValid(idInvalido), 'Identificador malformado identificado como inválido (400 esperado)');

  } catch (erroGeral) {
    console.error('\n[ERRO NA EXECUÇÃO DOS TESTES]:', erroGeral);
    testesFalhos++;
  } finally {
    console.log('\n====================================================');
    console.log(`  RESULTADO FINAL: ${testesPassados} passaram | ${testesFalhos} falharam`);
    console.log('====================================================\n');
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  executarTestes();
}

module.exports = executarTestes;
