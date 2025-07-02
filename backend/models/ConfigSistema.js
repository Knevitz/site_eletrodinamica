const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ConfigSistema = sequelize.define(
  "ConfigSistema",
  {
    chave: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    valor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "configsistema",
  }
);

module.exports = ConfigSistema;
