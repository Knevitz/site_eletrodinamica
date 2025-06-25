const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Cotacao = sequelize.define("Cotacao", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  clienteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dataEnvio: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Enviado",
  },
  itens: {
    type: DataTypes.JSON, // array de produtos com nome/id/quantidade etc.
    allowNull: false,
  },
});

module.exports = Cotacao;
