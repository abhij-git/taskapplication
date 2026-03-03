const { v4: uuidv4 } = require('uuid');
const Transaction = require('../models/Transaction');
const { scoreWithOpenAI } = require('./aiRiskScorer');

const HIGH_RISK_THRESHOLD = Number(process.env.HIGH_RISK_THRESHOLD || 75);

function randomChoice(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function generateMockTransaction() {
  const amount = Number((Math.random() * 3000).toFixed(2));

  const locations = ['US', 'US', 'US', 'GB', 'DE', 'IN', 'NG', 'RU', 'CN'];
  const paymentMethods = ['card', 'card', 'card', 'wallet', 'bank_transfer', 'crypto', 'gift_card'];
  const merchants = ['Shopify Store', 'ElectroMart', 'FashionHub', 'GadgetWorld', 'GameZone'];

  return {
    transactionId: uuidv4(),
    userId: `user_${Math.floor(Math.random() * 50) + 1}`,
    amount,
    currency: 'USD',
    paymentMethod: randomChoice(paymentMethods),
    ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    location: randomChoice(locations),
    merchant: randomChoice(merchants),
    status: Math.random() < 0.07 ? 'declined' : 'approved',
  };
}

function startTransactionStream(io) {
  const intervalMs = Number(process.env.MOCK_TX_INTERVAL_MS || 3000);

  console.log(`Starting mock transaction stream every ${intervalMs}ms`);

  setInterval(async () => {
    const baseTx = generateMockTransaction();

    try {
      const { riskScore, riskReason } = await scoreWithOpenAI(baseTx);
      const isHighRisk = riskScore >= HIGH_RISK_THRESHOLD;

      const txDoc = await Transaction.create({
        ...baseTx,
        riskScore,
        riskReason,
        isHighRisk,
      });

      const payload = txDoc.toObject();
      io.of('/transactions').emit('transaction', payload);

      if (isHighRisk) {
        io.of('/transactions').emit('highRisk', payload);
      }
    } catch (err) {
      console.error('Error generating or saving transaction:', err.message);
    }
  }, intervalMs);
}

module.exports = {
  startTransactionStream,
};

