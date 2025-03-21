import React from "react";
import "./TransactionTable.css";

interface Transaction {
    routingNumber: string;
    accountNumber: string;
    amount: number;
    individualName: string;
    traceNumber: string;
}

const TransactionTable: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    return (
        <table className="transaction-table">
            <thead>
                <tr>
                    <th>Routing Number</th>
                    <th>Account Number</th>
                    <th>Amount</th>
                    <th>Individual Name</th>
                    <th>Trace Number</th>
                </tr>
            </thead>
            <tbody>
                {transactions.length > 0 ? (
                    transactions.map((tx, index) => (
                        <tr key={index}>
                            <td>{tx.routingNumber}</td>
                            <td>{tx.accountNumber}</td>
                            <td>${tx.amount.toFixed(2)}</td>
                            <td>{tx.individualName}</td>
                            <td>{tx.traceNumber}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={5} style={{ textAlign: "center" }}>No transactions available</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default TransactionTable;
