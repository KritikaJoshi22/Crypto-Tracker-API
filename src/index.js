const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cryptoRoutes = require("./routes/cryptoRoutes");
const cron = require("node-cron");
const {
  fetchCryptoDataFromAPI,
  storeCryptoDataInDB,
} = require("./controllers/cryptoController");

dotenv.config();

const app = express();
const COINS = ["bitcoin", "matic-network", "ethereum"];
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON request bodies
app.use(express.json());

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the app if the database connection fails
  }
};

// Routes
app.use("/api", cryptoRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Crypto Stats API is running!");
});

// Fetch and store crypto data (manual or scheduled)
const fetchAndStoreCryptoData = async () => {
  console.log("Fetching and storing cryptocurrency data...");
  for (const coin of COINS) {
    try {
      const cryptoData = await fetchCryptoDataFromAPI(coin);
      if (cryptoData) {
        await storeCryptoDataInDB(cryptoData);
        console.log(`Data stored for ${coin}:`, cryptoData);
      }
    } catch (error) {
      console.error(`Error processing ${coin}:`, error.message);
    }
  }
  console.log("Crypto data fetching and storing completed.");
};

// Run Task 1 manually on startup
(async () => {
  console.log("Running manual Task 1 on startup...");
  await fetchAndStoreCryptoData();
})();

// Scheduled Task: Fetch and store data every 2 hours
cron.schedule("0 */2 * * *", async () => {
  console.log("Running scheduled Task 1: Fetch and Store Cryptocurrency Data");
  await fetchAndStoreCryptoData();
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();
});
