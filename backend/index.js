const express = require("express");
const apiRoutes = require("./routes/api");
const { Sequelize } = require("sequelize");
const config = require("./config/config.json");
const cors = require("cors");
const helmet = require("helmet");

const environment = process.env.NODE_ENV || "development";
const dbConfig = config[environment];

const sequelize = new Sequelize(dbConfig);

const connectToDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("success: connection to db");
  } catch (err) {
    console.log(err);
  }
};

module.exports = { sequelize, connectToDb };

const app = express();
const port = 3001;

app.use(cors());

// tilføjet helmet med CSP
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
    },
  })
);

app.use(express.json());
app.use("/api", apiRoutes);

app.listen(port, async () => {
  console.log(`server run at http://localhost${port}`);
  await connectToDb();
});
