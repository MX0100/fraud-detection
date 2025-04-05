import React from "react";
import "./TransactionTable.css";

interface SuspiciousTransaction {
  id: string;
  transactionId: string;
  routingNumber: string;
  accountNumber: string;
  amount: number;
  individualName: string;
  traceNumber: string;
  riskScore: number;
  fraudIndicators: string[];
  timestamp: string;
}

const SuspiciousTransactionTable: React.FC<{
  transactions: SuspiciousTransaction[];
  onViewDetails: (id: string) => void;
}> = ({ transactions, onViewDetails }) => {
  return (
    <table className="transaction-table suspicious-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Account Info</th>
          <th>Amount</th>
          <th>Name</th>
          <th>Risk Score</th>
          <th>Suspicious Indicators</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {transactions && transactions.length > 0 ? (
          transactions.map((tx) => (
            <tr
              key={tx.id}
              className={
                tx.riskScore > 75
                  ? "high-risk"
                  : tx.riskScore > 40
                  ? "medium-risk"
                  : "low-risk"
              }
            >
              <td>{new Date(tx.timestamp).toLocaleDateString()}</td>
              <td>
                <div>Routing: {tx.routingNumber}</div>
                <div>Account: {tx.accountNumber}</div>
              </td>
              <td>${tx.amount.toFixed(2)}</td>
              <td>{tx.individualName}</td>
              <td>
                <div className="risk-score">{tx.riskScore}</div>
              </td>
              <td>
                <ul className="fraud-indicators">
                  {tx.fraudIndicators &&
                    tx.fraudIndicators.map((indicator, i) => (
                      <li key={i}>{indicator}</li>
                    ))}
                </ul>
              </td>
              <td>
                <button
                  onClick={() => onViewDetails(tx.transactionId || tx.id)}
                  className="view-details-btn"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={7} style={{ textAlign: "center" }}>
              No suspicious transactions
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default SuspiciousTransactionTable;
