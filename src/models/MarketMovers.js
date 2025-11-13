/**
 * Market Movers MongoDB Schema
 */

import mongoose from 'mongoose';

const marketMoversSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['gainer', 'loser', 'active_value', 'active_volume'],
    index: true
  },

  symbol: { type: String, required: true, index: true },
  lastPrice: Number,
  change: Number,
  pChange: Number,

  previousClose: Number,
  open: Number,
  dayHigh: Number,
  dayLow: Number,

  totalTradedVolume: Number,
  totalTradedValue: Number,

  yearHigh: Number,
  yearLow: Number,

  // Ranking
  rank: Number,

  // Metadata
  date: { type: Date, default: Date.now, index: true },
  scrapedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'market_movers'
});

// Compound index for queries
marketMoversSchema.index({ type: 1, date: -1 });
marketMoversSchema.index({ symbol: 1, type: 1, date: -1 });

export default mongoose.model('MarketMovers', marketMoversSchema);
