const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Categoria = require("./Categoria");

const Produto = sequelize.define("Produto", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  imagem: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pdf: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  codigoPadrao: {
    type: DataTypes.STRING,
    allowNull: true, // agora pode ser nulo
    validate: {
      notEmpty: function () {
        if (
          !this.codigoPadrao &&
          (!this.codigosPorOpcao || this.codigosPorOpcao.length === 0)
        ) {
          throw new Error(
            "Produto deve ter um código padrão ou ao menos um código por opção."
          );
        }
      },
    },
  },
  opcoesSelect: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null,
  },
  codigosPorOpcao: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null,
  },
  categoriaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Categoria,
      key: "id",
    },
  },
});

module.exports = Produto;
