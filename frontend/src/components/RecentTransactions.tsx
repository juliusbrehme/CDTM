import { Badge } from "@/components/ui/badge";

import { useEffect, useState } from 'react';

// const transactions = [
//   {
//     id: 1,
//     name: "Apple Inc.",
//     type: "Buy",
//     amount: 120.5,
//     date: "Today",
//     symbol: "AAPL",
//   },
//   {
//     id: 2,
//     name: "Bank Transfer",
//     type: "Deposit",
//     amount: 1000,
//     date: "Yesterday",
//   },
//   {
//     id: 3,
//     name: "Amazon.com Inc.",
//     type: "Sell",
//     amount: 345.2,
//     date: "May 2",
//     symbol: "AMZN",
//   },
//   {
//     id: 4,
//     name: "ATM Withdrawal",
//     type: "Withdraw",
//     amount: 200,
//     date: "Apr 28",
//   },
// ];

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/transactions?limit=25')
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(console.error);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 animate-fade-in">
      <h3 className="text-lg text-gray-500 mb-4">Recent Transactions</h3>

      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.side === "credit"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {transaction.currency?.[0] ?? "?"}
              </div>
              <div className="ml-3">
                <div className="font-medium">User {transaction.userId}</div>
                <div className="text-xs text-gray-500">{transaction.bookingDate}</div>
              </div>
            </div>

            <div className="flex items-center">
              <div
                className={`mr-3 text-right ${
                  transaction.side === "debit"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {transaction.side === "debit" ? "-" : "+"}
                €{parseFloat(transaction.amount).toFixed(2)}
              </div>

              <span
                className={`text-xs font-medium px-2 py-1 rounded ${
                  transaction.type === "purchase"
                    ? "bg-blue-100 text-blue-800"
                    : transaction.type === "refund"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {transaction.type}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 text-purple-600 font-medium text-sm hover:underline">
        View All Transactions
      </button>
    </div>
  );
};

export default RecentTransactions;
