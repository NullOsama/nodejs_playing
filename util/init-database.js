const sequelize = require("./database");

const initializeDatabase = async (force) => {
  await sequelize.sync({ force: force });
};

module.exports = initializeDatabase;
