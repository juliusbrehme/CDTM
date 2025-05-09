
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import PortfolioChart from "@/components/PortfolioChart";
import AccountBalance from "@/components/AccountBalance";
import AssetDistribution from "@/components/AssetDistribution";
import RecentTransactions from "@/components/RecentTransactions";
import { BarChart, Wallet, PieChart, Bell, X } from "lucide-react";

const Index = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [showPortfolioChart, setShowPortfolioChart] = useState(true);
  const [showAssetDistribution, setShowAssetDistribution] = useState(true);
  const [showRecentTransactions, setShowRecentTransactions] = useState(true);
  
  const handleGenerateVisualization = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the user prompt to generate a visualization
    console.log("Generating visualization based on:", userPrompt);
    // Reset the input after submission
    setUserPrompt("");
  };

  return (
    <div className="min-h-screen bg-traderepublic-gray flex flex-col">
      <Navbar />
      
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-traderepublic-darkpurple">Dashboard</h1>
              <p className="text-gray-500">Welcome back, John</p>
            </div>
            
            <div className="flex mt-4 md:mt-0 space-x-2">
              <Button variant="outline" size="icon" className="h-10 w-10 border-gray-200">
                <Bell className="h-5 w-5 text-gray-500" />
              </Button>
              
              <Button className="bg-traderepublic-purple hover:bg-traderepublic-darkpurple">
                <PieChart className="h-4 w-4 mr-2" />
                Investment Report
              </Button>
            </div>
          </div>
          
          {/* User Input for Visualization */}
          <form onSubmit={handleGenerateVisualization} className="mb-6">
            <div className="flex gap-2">
              <Input
                placeholder="Enter a prompt to generate visualization (e.g., 'Show my spending by category')"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                className="flex-grow border-gray-200 focus:border-traderepublic-purple"
              />
              <Button 
                type="submit" 
                className="bg-traderepublic-purple hover:bg-traderepublic-darkpurple"
                disabled={!userPrompt.trim()}
              >
                Generate
              </Button>
            </div>
          </form>
          
          {/* Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Portfolio Chart (2/3 width on large screens) */}
            {showPortfolioChart && (
              <div className="lg:col-span-2 relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-2 z-10 h-8 w-8 bg-white/80 hover:bg-gray-100"
                  onClick={() => setShowPortfolioChart(false)}
                >
                  <X className="h-4 w-4 text-gray-700" />
                </Button>
                <PortfolioChart />
              </div>
            )}
            
            {/* Account Balance (1/3 width on large screens) */}
            <div>
              <AccountBalance />
            </div>
            
            {/* Asset Distribution (1/3 width on large screens) */}
            {showAssetDistribution && (
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-2 z-10 h-8 w-8 bg-white/80 hover:bg-gray-100"
                  onClick={() => setShowAssetDistribution(false)}
                >
                  <X className="h-4 w-4 text-gray-700" />
                </Button>
                <AssetDistribution />
              </div>
            )}
            
            {/* Recent Transactions (2/3 width on large screens) */}
            {showRecentTransactions && (
              <div className="lg:col-span-2 relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-2 z-10 h-8 w-8 bg-white/80 hover:bg-gray-100"
                  onClick={() => setShowRecentTransactions(false)}
                >
                  <X className="h-4 w-4 text-gray-700" />
                </Button>
                <RecentTransactions />
              </div>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Button variant="outline" className="p-4 h-auto flex flex-col items-center justify-center border-gray-200 hover:border-traderepublic-purple hover:bg-white">
              <Wallet className="h-6 w-6 text-traderepublic-purple mb-2" />
              <span className="text-sm text-gray-700">Manage Payment</span>
            </Button>
            
            <Button variant="outline" className="p-4 h-auto flex flex-col items-center justify-center border-gray-200 hover:border-traderepublic-purple hover:bg-white">
              <BarChart className="h-6 w-6 text-traderepublic-purple mb-2" />
              <span className="text-sm text-gray-700">Performance</span>
            </Button>
            
            <Button variant="outline" className="p-4 h-auto flex flex-col items-center justify-center border-gray-200 hover:border-traderepublic-purple hover:bg-white">
              <PieChart className="h-6 w-6 text-traderepublic-purple mb-2" />
              <span className="text-sm text-gray-700">Portfolio</span>
            </Button>
            
            <Button variant="outline" className="p-4 h-auto flex flex-col items-center justify-center border-gray-200 hover:border-traderepublic-purple hover:bg-white">
              <Bell className="h-6 w-6 text-traderepublic-purple mb-2" />
              <span className="text-sm text-gray-700">Alerts</span>
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-traderepublic-darkpurple">
              <span className="text-traderepublic-purple">Trade</span>Finance
            </h2>
            <p className="text-sm text-gray-500">© 2025 TradeFinance. All rights reserved.</p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-600 hover:text-traderepublic-purple">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-600 hover:text-traderepublic-purple">Terms of Service</a>
            <a href="#" className="text-sm text-gray-600 hover:text-traderepublic-purple">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
