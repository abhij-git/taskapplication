const express = require('express');
const Transaction = require('../models/Transaction');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get(
  '/',
  authMiddleware(['admin', 'analyst']),
  async (req, res) => {
    try {
      const limit = Number(req.query.limit || 100);
      const transactions = await Transaction.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      res.json(transactions);
    } catch (err) {
      console.error('Error fetching transactions:', err.message);
      res.status(500).json({ message: 'Failed to load transactions' });
    }
  }
);

router.get(
  '/risk-trend',
  authMiddleware(['admin', 'analyst']),
  async (req, res) => {
    try {
      const sinceMinutes = Number(req.query.sinceMinutes || 60);
      const sinceDate = new Date(Date.now() - sinceMinutes * 60 * 1000);

      const buckets = await Transaction.aggregate([
        { $match: { createdAt: { $gte: sinceDate } } },
        {
          $group: {
            _id: {
              $toDate: {
                $subtract: [
                  { $toLong: '$createdAt' },
                  {
                    $mod: [
                      { $toLong: '$createdAt' },
                      5 * 60 * 1000,
                    ],
                  },
                ],
              },
            },
            avgRisk: { $avg: '$riskScore' },
            count: { $sum: 1 },
            highRiskCount: {
              $sum: {
                $cond: [{ $gte: ['$riskScore', 75] }, 1, 0],
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      res.json(
        buckets.map((b) => ({
          timestamp: b._id,
          avgRisk: b.avgRisk,
          count: b.count,
          highRiskCount: b.highRiskCount,
        }))
      );
    } catch (err) {
      console.error('Error fetching risk trend:', err.message);
      res.status(500).json({ message: 'Failed to load risk trend' });
    }
  }
);

router.get(
  '/stats',
  authMiddleware(['admin']),
  async (req, res) => {
    try {
      const total = await Transaction.countDocuments();
      const highRisk = await Transaction.countDocuments({ isHighRisk: true });

      res.json({
        total,
        highRisk,
      });
    } catch (err) {
      console.error('Error fetching stats:', err.message);
      res.status(500).json({ message: 'Failed to load stats' });
    }
  }
);

module.exports = router;

