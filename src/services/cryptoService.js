const axios = require("axios");
const CryptoData = require("../models/cryptoModel");

// Helper function to fetch and save data
const fetchAndStoreCryptoData = async () => {
  try {
    const coins = ["bitcoin", "matic-network", "ethereum"];
    const url = `https://api.coingecko.com/api/v3/simple/price`;

    const response = await axios.get(url, {
      params: {
        ids: coins.join(","),
        vs_currencies: "usd",
        include_market_cap: "true",
        include_24hr_change: "true",
      },
    });

    const data = response.data;
    for (const coin of coins) {
      const record = new CryptoData({
        coin,
        price: data[coin].usd,
        marketCap: data[coin].usd_market_cap,
        change24h: data[coin].usd_24h_change,
      });
      await record.save();
    }
    console.log("Cryptocurrency data saved successfully!");
  } catch (error) {
    console.error("Error fetching or saving cryptocurrency data:", error);
  }
};

module.exports = fetchAndStoreCryptoData;
