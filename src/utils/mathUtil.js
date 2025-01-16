// utils/mathUtil.js
const calculateStandardDeviation = (prices) => {
  const mean = prices.reduce((sum, value) => sum + value, 0) / prices.length;
  const variance =
    prices.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
    prices.length;
  return Math.sqrt(variance);
};

module.exports = { calculateStandardDeviation };
