function TransactionTable({ transactions }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Live Transactions</h2>
        <span className="panel-meta">{transactions.length} recent</span>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Txn ID</th>
              <th>User</th>
              <th>Amount</th>
              <th>Location</th>
              <th>Method</th>
              <th>Status</th>
              <th>Risk</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const date = new Date(tx.createdAt);
              const isHigh = tx.isHighRisk || tx.riskScore >= 75;
              return (
                <tr key={tx._id || tx.transactionId} className={isHigh ? 'row-high' : ''}>
                  <td>{date.toLocaleTimeString()}</td>
                  <td className="mono">{tx.transactionId}</td>
                  <td>{tx.userId}</td>
                  <td>${tx.amount?.toFixed(2)}</td>
                  <td>{tx.location}</td>
                  <td>{tx.paymentMethod}</td>
                  <td>{tx.status}</td>
                  <td>
                    <span className={`badge ${isHigh ? 'badge-high' : 'badge-low'}`}>
                      {Math.round(tx.riskScore)}
                    </span>
                  </td>
                </tr>
              );
            })}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={8} className="empty-state">
                  Waiting for transactions…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionTable;

