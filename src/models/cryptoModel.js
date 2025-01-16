const mongoose = require("mongoose");

// Define the schema for cryptocurrency data
const cryptoSchema = new mongoose.Schema({
  coin: { type: String, required: true, unique: true },
  currentPrice: { type: Number, required: true },
  marketCap: { type: Number, required: true },
  change24h: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now },
});

// Create the model
const Crypto = mongoose.model("Crypto", cryptoSchema);

module.exports = Crypto;
