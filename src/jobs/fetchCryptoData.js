const axios = require("axios");
const Crypto = require("../models/cryptoModel"); // Import the Crypto model

// Your CoinGecko demo API key
const API_KEY = "YOUR_API_KEY";

// CoinGecko cryptocurrency IDs
const CRYPTO_IDS = ["bitcoin", "matic-network", "ethereum"];

const fetchCryptoData = async () => {
  try {
    for (let coinId of CRYPTO_IDS) {
      // Make the API request with the API key
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}`,
        {
          headers: {
            x_cg_demo_api_key: API_KEY, // Include the API key in the headers
          },
        }
      );

      const { market_data } = response.data;

      // Prepare the data for database insertion
      const cryptoData = {
        coin: coinId,
        price: market_data.current_price.usd,
        marketCap: market_data.market_cap.usd,
        "24hChange": market_data.price_change_percentage_24h,
        timestamp: new Date(),
      };

      // Insert data into MongoDB
      await Crypto.create(cryptoData);
      console.log(`Data for ${coinId} inserted successfully.`);
    }
  } catch (error) {
    console.error(
      "Error fetching cryptocurrency data:",
      error.response?.data || error.message
    );
  }
};

// Run the background job every 2 hours
setInterval(fetchCryptoData, 2 * 60 * 60 * 1000);

// Fetch data immediately when the application starts
fetchCryptoData();
