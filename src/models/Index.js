/**
 * Index MongoDB Schema
 */

import mongoose from 'mongoose';

const indexSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },

  // Price Data
  last: Number,
  open: Number,
  high: Number,
  low: Number,
  previousClose: Number,

  // Change
  change: Number,
  pChange: Number,

  // Year Range
  yearHigh: Number,
  yearLow: Number,

  // Ratios
  peRatio: Number,
  pbRatio: Number,
  dividendYield: Number,

  // Market Breadth
  advances: Number,
  declines: Number,
  unchanged: Number,

  // Performance
  perChange30d: Number,
  perChange365d: Number,

  // Metadata
  lastUpdateTime: Date,
  dataSource: { type: String, default: 'NSE' },
  scrapedAt: { type: Date, default: Date.now, index: true }
}, {
  timestamps: true,
  collection: 'indices'
});

// Compound index
indexSchema.index({ name: 1, scrapedAt: -1 });

export default mongoose.model('Index', indexSchema);
