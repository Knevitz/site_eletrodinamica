const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Produto = require("./Produto");

const CodigosPorOpcao = sequelize.define("CodigosPorOpcao", {
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  opcoes: {
    type: DataTypes.JSON,
    allowNull: false,
  },
});

CodigosPorOpcao.belongsTo(Produto, {
  foreignKey: "produtoId",
  onDelete: "CASCADE",
});
Produto.hasMany(CodigosPorOpcao, { foreignKey: "produtoId" });

module.exports = CodigosPorOpcao;
