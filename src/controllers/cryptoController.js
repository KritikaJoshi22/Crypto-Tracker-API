const axios = require("axios");
const Crypto = require("../models/cryptoModel");
const cron = require("node-cron");

// CoinGecko IDs for the cryptocurrencies
const COINS = ["bitcoin", "matic-network", "ethereum"];

// Fetch data from CoinGecko API
const fetchCryptoDataFromAPI = async (coin) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coin}`
    );
    const { current_price, market_cap, price_change_percentage_24h } =
      response.data.market_data;
    return {
      coin,
      currentPrice: current_price.usd,
      marketCap: market_cap.usd,
      change24h: price_change_percentage_24h,
    };
  } catch (error) {
    console.error(`Error fetching data for ${coin}:`, error.message);
    return null;
  }
};

// Store cryptocurrency data in the database
const storeCryptoDataInDB = async (cryptoData) => {
  try {
    // Insert a new document with a timestamp
    const newEntry = new Crypto({
      coin: cryptoData.coin,
      currentPrice: cryptoData.currentPrice,
      marketCap: cryptoData.marketCap,
      change24h: cryptoData.change24h,
      lastUpdated: new Date(), // Record the fetch time
    });

    await newEntry.save();
    console.log(`Data stored for ${cryptoData.coin}:`, newEntry);
  } catch (error) {
    console.error(`Error storing data for ${cryptoData.coin}:`, error.message);
  }
};

// Background job to fetch and store data for all cryptocurrencies every 2 hours
cron.schedule("0 */2 * * *", async () => {
  console.log("Running background job to fetch cryptocurrency data...");
  for (const coin of COINS) {
    const cryptoData = await fetchCryptoDataFromAPI(coin);
    if (cryptoData) {
      await storeCryptoDataInDB(cryptoData);
      console.log(`Data updated for ${coin}`);
    }
  }
  console.log("Background job completed.");
});

// API Endpoint: Fetch the latest cryptocurrency data from the database
const getCryptoStats = async (req, res) => {
  try {
    const { coin } = req.query; // Get the coin from the query parameter

    // Validate the coin parameter
    if (!COINS.includes(coin)) {
      return res.status(400).json({
        error: "Invalid coin. Choose from bitcoin, matic-network, ethereum.",
      });
    }

    // Fetch the most recent data for the specified coin
    const data = await Crypto.findOne({ coin })
      .sort({ lastUpdated: -1 }) // Sort by most recent
      .select("coin currentPrice marketCap change24h lastUpdated");

    // If no data exists for the coin, return a 404 response
    if (!data) {
      return res
        .status(404)
        .json({ error: "No data found for the requested cryptocurrency" });
    }

    // Format the response to include only relevant fields
    const response = {
      coin: data.coin,
      price: data.currentPrice,
      marketCap: data.marketCap,
      "24hChange": data.change24h,
      lastUpdated: data.lastUpdated, // Include timestamp
    };

    // Return the formatted data for the requested coin
    res.status(200).json(response);
  } catch (error) {
    console.error(
      "Error fetching cryptocurrency data from the database:",
      error.message
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

// API Endpoint: Calculate the standard deviation of the price for the requested cryptocurrency
const getDeviation = async (req, res) => {
  try {
    const { coin } = req.query; // Get the coin from the query parameter
    if (!COINS.includes(coin)) {
      return res.status(400).json({
        error: "Invalid coin. Choose from bitcoin, matic-network, ethereum.",
      });
    }

    // Fetch the last 100 records for the requested cryptocurrency
    const data = await Crypto.find({ coin })
      .sort({ lastUpdated: -1 })
      .limit(100);
    if (data.length === 0) {
      return res
        .status(404)
        .json({ error: "Not enough data to calculate deviation" });
    }

    // Extract the prices and calculate the standard deviation
    const prices = data.map((record) => record.currentPrice);
    const { calculateStandardDeviation } = require("../utils/mathUtil");
    const deviation = calculateStandardDeviation(prices);

    // Return the deviation response
    res.status(200).json({ deviation: deviation.toFixed(2) });
  } catch (error) {
    console.error("Error calculating standard deviation:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getCryptoStats,
  getDeviation,
  fetchCryptoDataFromAPI,
  storeCryptoDataInDB,
};
