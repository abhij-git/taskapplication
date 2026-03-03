const axios = require('axios');

function heuristicScore(transaction) {
  let score = 10;

  if (transaction.amount > 500) score += 25;
  if (transaction.amount > 2000) score += 25;

  const highRiskCountries = ['RU', 'NG', 'PK', 'CN'];
  if (transaction.location && highRiskCountries.includes(transaction.location)) {
    score += 20;
  }

  if (transaction.paymentMethod && ['crypto', 'gift_card'].includes(transaction.paymentMethod)) {
    score += 20;
  }

  if (transaction.status === 'declined') {
    score += 10;
  }

  if (score > 100) score = 100;
  return {
    riskScore: score,
    riskReason: 'Heuristic-based risk scoring (fallback, no AI key configured)',
  };
}

async function scoreWithOpenAI(transaction) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return heuristicScore(transaction);
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are an AI fraud detector for e-commerce transactions. ' +
              'Given a JSON transaction, respond ONLY with a JSON object ' +
              'containing "riskScore" (0-100) and "reason" (short explanation).',
          },
          {
            role: 'user',
            content: `Transaction JSON: ${JSON.stringify(transaction)}`,
          },
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 8000,
      }
    );

    const content = response.data.choices?.[0]?.message?.content;
    if (!content) {
      return heuristicScore(transaction);
    }

    const parsed = JSON.parse(content);
    const riskScore = Math.min(100, Math.max(0, Number(parsed.riskScore) || 0));

    return {
      riskScore,
      riskReason: parsed.reason || 'AI model risk assessment',
    };
  } catch (err) {
    console.error('OpenAI scoring failed, using heuristic fallback:', err.message);
    return heuristicScore(transaction);
  }
}

module.exports = {
  scoreWithOpenAI,
  heuristicScore,
};

