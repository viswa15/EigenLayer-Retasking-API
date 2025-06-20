const mongoose = require('mongoose');

const slashHistorySchema = new mongoose.Schema({
  timestamp: { type: Date },
  amount: { type: String }, // Amount slashed
  reason: { type: String }, // Reason if available
});

const validatorSchema = new mongoose.Schema({
  operatorAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  operatorId: { // Sometimes available, useful for identification
    type: String,
    // No 'required' as it might not always be present or easily obtainable
  },
  totalDelegatedStake: {
    type: String, // Store as string for precision
    required: true,
  },
  status: {
    type: String, // e.g., 'ACTIVE', 'INACTIVE', 'JAILED', 'SLASHED'
    required: true,
  },
  slashHistory: [slashHistorySchema], // Array of slash events
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

validatorSchema.index({ operatorAddress: 1 });
validatorSchema.index({ status: 1 });

module.exports = mongoose.model('Validator', validatorSchema);