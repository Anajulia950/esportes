const mongoose = require('mongoose');

const AcessorioSchema = new mongoose.Schema(
  {
    esporte: {
      type: String,
      required: [true, "O campo 'esporte' é obrigatório."],
      trim: true,
      minlength: [2, "O esporte deve ter no mínimo 2 caracteres."],
      maxlength: [60, "O esporte não pode ultrapassar 60 caracteres."],
    },
    marca: {
      type: String,
      required: [true, "O campo 'marca' é obrigatório."],
      trim: true,
      minlength: [2, "A marca deve ter no mínimo 2 caracteres."],
      maxlength: [60, "A marca não pode ultrapassar 60 caracteres."],
    },
    modelo: {
      type: String,
      required: [true, "O campo 'modelo' é obrigatório."],
      trim: true,
      minlength: [2, "O modelo deve ter no mínimo 2 caracteres."],
      maxlength: [100, "O modelo não pode ultrapassar 100 caracteres."],
    },
    preco: {
      type: Number,
      required: [true, "O campo 'preco' é obrigatório."],
      min: [0, "O preço deve ser maior ou igual a zero."],
      validate: {
        validator: function (valor) {
          return !isNaN(valor) && isFinite(valor);
        },
        message: "O preço deve ser um número válido.",
      },
    },
    foto: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true, // Cria e gerencia createdAt e updatedAt automaticamente
    versionKey: false,
  }
);

// Índice composto para otimizar pesquisas por texto em busca rápida
AcessorioSchema.index({ esporte: 1, marca: 1, modelo: 1 });

module.exports = mongoose.models.Acessorio || mongoose.model('Acessorio', AcessorioSchema);
