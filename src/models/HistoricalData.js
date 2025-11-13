/**
 * Historical Data MongoDB Schema
 */

import mongoose from 'mongoose';

const historicalDataSchema = new mongoose.Schema({
  symbol: { type: String, required: true, index: true },
  date: { type: Date, required: true, index: true },

  // OHLCV
  open: Number,
  high: Number,
  low: Number,
  close: Number,
  lastPrice: Number,
  previousClose: Number,

  // Volume & Value
  totalTradedVolume: Number,
  totalTradedValue: Number,
  totalTrades: Number,

  // Delivery
  deliveryQuantity: Number,
  deliveryPercentage: Number,

  // 52 Week Range
  week52High: Number,
  week52Low: Number,

  // VWAP
  vwap: Number,

  // Metadata
  series: String,
  isin: String,
  dataSource: { type: String, default: 'NSE' },
  scrapedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'historical_data'
});

// Compound unique index to prevent duplicates
historicalDataSchema.index({ symbol: 1, date: 1 }, { unique: true });

// Index for time-series queries
historicalDataSchema.index({ date: -1 });
historicalDataSchema.index({ symbol: 1, date: -1 });

export default mongoose.model('HistoricalData', historicalDataSchema);
