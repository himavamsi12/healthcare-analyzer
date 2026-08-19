require("dotenv").config();
const express = require("express");
const cors = require("cors");

const foodRoutes = require("./routes/food");
const instamartRoutes = require("./routes/instamart");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", mode: process.env.APP_MODE || "mock" });
});

// Routes
app.use("/api/food", foodRoutes);
app.use("/api/instamart", instamartRoutes);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`CareOrder backend running on http://localhost:${PORT}`);
    console.log(`Mode: ${process.env.APP_MODE || "mock"}`);
  });
}

module.exports = app;
