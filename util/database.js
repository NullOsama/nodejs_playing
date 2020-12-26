const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-train", "root", "165129Os*", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
