const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(morgan("combined"));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.json({ message: "Backend API running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});