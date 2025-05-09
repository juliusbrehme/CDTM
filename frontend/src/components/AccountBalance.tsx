import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { useState } from "react";

const AccountBalance = () => {
  const [amount, setAmount] = useState("");

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full animate-slide-in">
      <div className="flex flex-col h-full">
        <h3 className="text-lg text-gray-500">Account Balance</h3>
        <p className="text-3xl font-bold mt-2">€10,250.84</p>

        <div className="border-t border-gray-100 my-6"></div>

        <div className="flex-grow">
          <div className="mb-4">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Amount (€)
            </label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border-gray-300 focus:ring-traderepublic-purple focus:border-traderepublic-purple"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button className="bg-traderepublic-purple hover:bg-traderepublic-darkpurple flex items-center justify-center">
              <ArrowUpIcon className="h-4 w-4 mr-2" />
              Deposit
            </Button>
            <Button
              variant="outline"
              className="border-traderepublic-purple text-traderepublic-purple hover:bg-traderepublic-purple hover:text-white flex items-center justify-center"
            >
              <ArrowDownIcon className="h-4 w-4 mr-2" />
              Withdraw
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <Button className="w-full flex items-center justify-center bg-traderepublic-darkpurple hover:bg-black">
            <PlusIcon className="h-4 w-4 mr-2" />
            New Investment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountBalance;
