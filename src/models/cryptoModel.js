const mongoose = require("mongoose");

const cryptoSchema = new mongoose.Schema(
  {
    coin: { type: String, required: true, trim: true, lowercase: true },
    currentPrice: { type: Number, required: true, min: 0 },
    marketCap: { type: Number, required: true, min: 0 },
    change24h: { type: Number, required: true },
  },
  {
    versionKey: false, // Disables __v field
  }
);

const Crypto = mongoose.model("Crypto", cryptoSchema);

module.exports = Crypto;
