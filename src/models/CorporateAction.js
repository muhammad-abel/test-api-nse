/**
 * Corporate Action MongoDB Schema
 */

import mongoose from 'mongoose';

const corporateActionSchema = new mongoose.Schema({
  symbol: { type: String, required: true, index: true },
  series: String,

  purpose: { type: String, required: true },
  exDate: Date,
  recordDate: Date,
  bcStartDate: Date,
  bcEndDate: Date,

  // Additional Details
  amount: Number, // For dividends
  ratio: String, // For splits, bonus

  // Metadata
  scrapedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'corporate_actions'
});

// Compound index to prevent duplicates
corporateActionSchema.index({ symbol: 1, exDate: 1, purpose: 1 }, { unique: true });

// Index for date queries
corporateActionSchema.index({ exDate: -1 });
corporateActionSchema.index({ symbol: 1, exDate: -1 });

export default mongoose.model('CorporateAction', corporateActionSchema);
