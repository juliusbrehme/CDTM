import React from "react";
import SankeyChart from "@/components/SankeyChart";
import Navbar from "@/components/Navbar";

const Sankey = () => {
  return (
    <div className="min-h-screen bg-traderepublic-gray flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-700 mb-6">Sankey Diagram</h1>
          <SankeyChart />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500">
          © 2025 TradeFinance. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Sankey;