import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { Bell, PieChart } from "lucide-react";
import Container from "@/components/Container.tsx";
import PortfolioChart from "@/components/PortfolioChart.tsx";
import RecentTransactions from "@/components/RecentTransactions.tsx";
import VegaChart from "@/components/VegaChart.tsx";

const Index = () => {
  const [userPrompt, setUserPrompt] = useState("");

  const [containers, setContainers] = useState<React.ReactNode[]>([
    <Container>
      <PortfolioChart />
    </Container>,
    <Container>
      <RecentTransactions />
    </Container>,
    // <Container>
    //   <VegaChart spec/>
    // </Container>,
  ]);

  const handleGenerateVisualization = async (e: React.FormEvent) => {
    e.preventDefault();
    const spec = await apiRequest(userPrompt);
    setUserPrompt(() => "");
    setContainers((prev) => [
      ...prev,
      <Container>
        <VegaChart spec={spec} />
      </Container>,
    ]);
  };

  async function apiRequest(prompt: string) {
    const response = await fetch("http://localhost:8000/api/generate-chart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userPrompt: prompt }),
    });
    console.log(response);
    if (!response.ok) {
      console.log("Error");
    } else {
      const data = await response.json();
      console.log(data);
      return data;
    }
  }

  const listContainer = containers.map((container) => container);

  return (
    <div className="min-h-screen bg-traderepublic-gray flex flex-col">
      <Navbar />

      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-traderepublic-darkpurple">
                Dashboard
              </h1>
              <p className="text-gray-500">Welcome back, John</p>
            </div>

            <div className="flex mt-4 md:mt-0 space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 border-gray-200"
              >
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
          <div>
            <div
              className={`mb-6 grid gap-4 ${listContainer.length !== 1 ? "grid-cols-2" : "grid-cols-1"}`}
            >
              {listContainer.map((container, index) => (
                <React.Fragment key={index}>{container}</React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-traderepublic-darkpurple">
              <span className="text-traderepublic-purple">Trade</span>Finance
            </h2>
            <p className="text-sm text-gray-500">
              © 2025 TradeFinance. All rights reserved.
            </p>
          </div>

          <div className="flex space-x-6">
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-traderepublic-purple"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-traderepublic-purple"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-traderepublic-purple"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
