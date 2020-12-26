const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-train", "root", "******", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
