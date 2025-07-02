const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Categoria = require("./Categoria");
const Produto = require("./Produto");
const CodigosPorOpcao = require("./CodigosPorOpcao");
const Usuario = require("./Usuario");

// Associações
Categoria.hasMany(Produto, { foreignKey: "categoriaId" });
Produto.belongsTo(Categoria, { foreignKey: "categoriaId" });

Produto.hasMany(CodigosPorOpcao, {
  foreignKey: "produtoId",
  as: "codigosPorOpcao",
});
CodigosPorOpcao.belongsTo(Produto, { foreignKey: "produtoId", as: "produto" });
module.exports = {
  sequelize,
  Sequelize,
  Categoria,
  Produto,
  CodigosPorOpcao,
  Usuario,
};
