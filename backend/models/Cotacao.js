const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Usuario = require("./Usuario");

const Cotacao = sequelize.define("Cotacao", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: "id",
    },
  },

  dataEnvio: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },

  status: {
    type: DataTypes.STRING,
    isIn: [["Enviado"]],
  },

  itens: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isValidoArrayDeItens(value) {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error("O campo 'itens' deve ser um array não vazio.");
        }

        for (const item of value) {
          if (
            !item.nome ||
            !item.codigo ||
            typeof item.quantidade !== "number" ||
            item.quantidade <= 0
          ) {
            throw new Error(
              "Cada item deve conter nome, código e quantidade válida."
            );
          }
        }
      },
    },
  },
});

Cotacao.belongsTo(Usuario, {
  foreignKey: "clienteId",
  as: "cliente",
});

module.exports = Cotacao;
