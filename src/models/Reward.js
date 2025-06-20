const mongoose = require('mongoose');

const rewardDetailSchema = new mongoose.Schema({
  operatorAddress: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  amount: {
    type: String, // Amount received from this specific validator
    required: true,
  },
  timestamp: {
    type: Date, // Timestamp of this specific reward (if available)
  },
});

const rewardSchema = new mongoose.Schema({
  userAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  totalRewardsReceived: {
    type: String, // Total rewards across all validators for this user
    default: '0',
  },
  rewardsBreakdown: [rewardDetailSchema],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

rewardSchema.index({ userAddress: 1 });

module.exports = mongoose.model('Reward', rewardSchema);