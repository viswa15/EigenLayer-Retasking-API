const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  totalRestakedAmountStETH: {
    type: String, // Store as string to preserve precision from subgraph
    required: true,
  },
  delegatedToOperatorAddress: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

userSchema.index({ address: 1 });
userSchema.index({ delegatedToOperatorAddress: 1 });

module.exports = mongoose.model('User', userSchema);