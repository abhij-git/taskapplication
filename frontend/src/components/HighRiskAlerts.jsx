function HighRiskAlerts({ alerts }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>High‑Risk Alerts</h2>
        <span className="panel-meta">{alerts.length} recent</span>
      </div>
      <div className="alerts-list">
        {alerts.length === 0 && (
          <div className="empty-state">No high‑risk alerts yet.</div>
        )}
        {alerts.map((tx) => {
          const date = new Date(tx.createdAt);
          return (
            <div
              key={tx._id || tx.transactionId}
              className="alert-card"
            >
              <div className="alert-main">
                <span className="badge badge-high">
                  {Math.round(tx.riskScore)}
                </span>
                <div className="alert-text">
                  <div className="alert-title">
                    {tx.merchant} · ${tx.amount?.toFixed(2)} · {tx.location}
                  </div>
                  <div className="alert-subtitle">
                    {tx.riskReason || 'High‑risk transaction detected'}
                  </div>
                </div>
              </div>
              <div className="alert-meta">
                <span>{tx.userId}</span>
                <span>{date.toLocaleTimeString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HighRiskAlerts;

