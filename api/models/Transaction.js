const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'USD' },
    paymentMethod: { type: String, required: true },
    ipAddress: { type: String },
    location: { type: String },
    merchant: { type: String },
    status: { type: String, default: 'approved' },

    riskScore: { type: Number, required: true },
    riskReason: { type: String },
    isHighRisk: { type: Boolean, default: false },
  },
  { timestamps: true }
);

TransactionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Transaction', TransactionSchema);

