const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

dotenv.config();
const db = require("./db");
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/task", require("./routes/task.route"));
app.use("/auth", require("./routes/auth.route"));

// CORS headers
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Server active." });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
    },
  });
});

// 🔥 START SERVER + DB CHECK (IMPORTANT PART)
db.query("SELECT 1")
  .then(() => {
    console.log("Database connection successful");

    app.listen(process.env.APP_PORT, () => {
      console.log(`Server running on port ${process.env.APP_PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });