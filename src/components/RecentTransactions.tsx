
import { Badge } from "@/components/ui/badge";

const transactions = [
  {
    id: 1,
    name: "Apple Inc.",
    type: "Buy",
    amount: 120.50,
    date: "Today",
    symbol: "AAPL"
  },
  {
    id: 2,
    name: "Bank Transfer",
    type: "Deposit",
    amount: 1000,
    date: "Yesterday",
  },
  {
    id: 3,
    name: "Amazon.com Inc.",
    type: "Sell",
    amount: 345.20,
    date: "May 2",
    symbol: "AMZN"
  },
  {
    id: 4,
    name: "ATM Withdrawal",
    type: "Withdraw",
    amount: 200,
    date: "Apr 28",
  }
];

const RecentTransactions = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 animate-fade-in">
      <h3 className="text-lg text-gray-500 mb-4">Recent Transactions</h3>
      
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                transaction.type === "Buy" || transaction.type === "Deposit" 
                  ? "bg-green-100 text-traderepublic-green" 
                  : "bg-red-100 text-traderepublic-red"
              }`}>
                {transaction.symbol 
                  ? transaction.symbol.substring(0, 1) 
                  : transaction.type === "Deposit" 
                    ? "+" 
                    : "-"
                }
              </div>
              <div className="ml-3">
                <div className="font-medium">{transaction.name}</div>
                <div className="text-xs text-gray-500">{transaction.date}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className={`mr-3 text-right ${
                transaction.type === "Buy" || transaction.type === "Withdraw" 
                  ? "text-traderepublic-red" 
                  : "text-traderepublic-green"
              }`}>
                {transaction.type === "Buy" || transaction.type === "Withdraw" ? "-" : "+"}
                €{transaction.amount.toFixed(2)}
              </div>
              
              <Badge className={`${
                transaction.type === "Buy" ? "bg-blue-100 text-blue-800" :
                transaction.type === "Sell" ? "bg-purple-100 text-purple-800" :
                transaction.type === "Deposit" ? "bg-green-100 text-green-800" :
                "bg-red-100 text-red-800"
              } hover:bg-opacity-80`}>
                {transaction.type}
              </Badge>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-traderepublic-purple font-medium text-sm hover:underline">
        View All Transactions
      </button>
    </div>
  );
};

export default RecentTransactions;
