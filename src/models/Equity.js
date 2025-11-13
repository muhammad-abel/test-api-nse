/**
 * Equity (Saham) MongoDB Schema
 */

import mongoose from 'mongoose';

const equitySchema = new mongoose.Schema({
  // Basic Info
  symbol: { type: String, required: true, index: true },
  companyName: String,
  industry: String,
  sector: String,
  isin: String,
  series: String,

  // Price Info
  lastPrice: Number,
  open: Number,
  high: Number,
  low: Number,
  close: Number,
  previousClose: Number,
  vwap: Number,

  // Change
  change: Number,
  pChange: Number,

  // 52 Week High/Low
  yearHigh: Number,
  yearLow: Number,
  yearHighDate: Date,
  yearLowDate: Date,

  // Intraday
  intraDayHigh: Number,
  intraDayLow: Number,

  // Circuit Limits
  upperCircuitLimit: Number,
  lowerCircuitLimit: Number,

  // Volume & Turnover
  totalTradedVolume: Number,
  totalTradedValue: Number,
  totalTrades: Number,
  deliveryQuantity: Number,
  deliveryPercentage: Number,

  // Market Cap & Ratios
  marketCap: Number,
  peRatio: Number,
  pbRatio: Number,
  dividendYield: Number,
  eps: Number,
  faceValue: Number,
  bookValue: Number,

  // Additional Info
  listingDate: Date,
  issuedSize: Number,

  // Metadata
  lastUpdateTime: Date,
  dataSource: { type: String, default: 'NSE' },
  scrapedAt: { type: Date, default: Date.now, index: true }
}, {
  timestamps: true,
  collection: 'equities'
});

// Compound index for symbol and date
equitySchema.index({ symbol: 1, scrapedAt: -1 });

// Index for queries by date
equitySchema.index({ createdAt: -1 });

export default mongoose.model('Equity', equitySchema);
