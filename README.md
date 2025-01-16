# Crypto Tracker API

The Crypto Tracker API provides real-time cryptocurrency statistics and analytics, including price, market cap, 24h price change, and historical price deviation calculations using data from CoinGecko.

## Features

- Real-time cryptocurrency stats (price, market cap, 24h change)
- Price deviation calculations based on historical data
- Automated data fetching every 2 hours
- Support for Bitcoin, Ethereum, and Polygon

## Tech Stack

- Node.js & Express
- MongoDB & Mongoose
- Axios
- Node-Cron

## Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/crypto-tracker.git
cd crypto-tracker
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:
   Create a `.env` file with:

```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/crypto-tracker
API_KEY=your_coingecko_api_key_here
```

4. Start the server:

```bash
npm start
```

## API Endpoints

### Get Cryptocurrency Stats

```
GET /api/stats?coin=bitcoin
```

Returns current price, market cap, and 24h change for the specified cryptocurrency.

Example response:

```json
{
  "price": 40000,
  "marketCap": 800000000,
  "24hChange": 3.4
}
```

### Get Price Deviation

```
GET /api/deviation?coin=bitcoin
```

Returns the standard deviation of prices based on historical data.

Example response:

```json
{
  "deviation": 4082.48
}
```

## Data Updates

The API automatically fetches new data from CoinGecko every 2 hours to maintain up-to-date statistics.

## Credits

Built with data from the CoinGecko API. For access to the API, obtain your key from [CoinGecko API Documentation](https://docs.coingecko.com/v3.0.1/reference/introduction).
