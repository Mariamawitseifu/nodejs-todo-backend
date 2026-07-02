const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
const app = express();
const sequelize = require("./db");

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/task", require("./routes/task.route"));
app.use("/auth", require("./routes/auth.route"));

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
    },
  });
});

app.get("/", (req, res) => {
  res.json({ message: "Server active." });
  // Start server (optionally test DB connection)
  db.query('SELECT 1')
    .then(() => {
      console.log('Database connection successful');
      app.listen(process.env.APP_PORT, () => {
        console.log(`Server running on port ${process.env.APP_PORT}`);
      });
    })
    .catch(err => {
      console.error('DB connection error:', err);
    });