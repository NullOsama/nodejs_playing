const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const initDB = require("./util/init-database");
const User = require("./models/user");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(async (req, res, next) => {
  const user = await User.findByPk(1);
  if (user) req.user = user;
  else await User.create({ name: "Osama", email: "test@testing.com" });
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

initDB(false);

app.listen(3000);
