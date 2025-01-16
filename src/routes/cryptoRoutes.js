const express = require("express");
const {
  getCryptoStats,
  getDeviation,
} = require("../controllers/cryptoController");

const router = express.Router();

// Route to get the latest stats of a cryptocurrency
router.get("/stats", getCryptoStats);

// Route to calculate the standard deviation of cryptocurrency prices
router.get("/deviation", getDeviation);

module.exports = router;
