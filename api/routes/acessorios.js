const express = require('express');
const router = express.Router();
const controller = require('../controllers/acessorioController');

// Endpoints da rota /api/acessorios
router.get('/', controller.listarAcessorios);
router.get('/:id', controller.obterAcessorioPorId);
router.post('/', controller.cadastrarAcessorio);
router.put('/:id', controller.atualizarAcessorio);
router.delete('/:id', controller.excluirAcessorio);

module.exports = router;
