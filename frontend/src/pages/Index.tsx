import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { Bell, PieChart, Mic } from "lucide-react";
import Container from "@/components/Container.tsx";
import PortfolioChart from "@/components/PortfolioChart.tsx";
import RecentTransactions from "@/components/RecentTransactions.tsx";
import RadarChart from "@/components/RadarChart.tsx";
import { Dendrogram } from "@/components/DendrogramChart";
import TreeMapChart from "@/components/TreeMapChart";

import RadarJSON from "@/data/test_radar.json";
import TreeJSON from "@/data/test_tree.json";
import DendrogramJSON from "@/data/test_dendogram.json";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

const SpeechRecognition = window.webkitSpeechRecognition || (window as any).SpeechRecognition;


const Index = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [isListening, setIsListening] = useState(false); // State to track if voice recognition is active
  const recognitionRef = useRef<InstanceType<typeof SpeechRecognition> | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref to store the timeout for stopping recognition
  const [containers, setContainers] = useState<React.ReactNode[]>([
    <Container>
      <PortfolioChart />
    </Container>,
    <Container>
      <RecentTransactions />
    </Container>,
  ]);

  const queries = [
    "Give me an overview of my spendings on food this month.",
    "What are my top spendings this month?",
    "How much did I spend on plants and gardening?",
  ];
  const handleGenerateVisualization = (e: React.FormEvent) => {
    e.preventDefault();
    if (queries.includes(userPrompt)) {
      const resultRadar = RadarJSON.find((item) => item.query === userPrompt);
      const radarTestData = resultRadar?.data;
      const resultTree = TreeJSON.find((item) => item.query === userPrompt);
      const treeTestData = resultTree?.data;

      const resultDendrogram = DendrogramJSON.find(
        (item) => item.query === userPrompt,
      );
      const dendrogramTestData = resultDendrogram?.data;
      setContainers((prev) => [
        ...prev,

        <Container colSpan="col-span-2">
          <TreeMapChart data={treeTestData} />
        </Container>,
        <Container>
          <RadarChart data={radarTestData} />
        </Container>,
        <Container>
          <Dendrogram data={dendrogramTestData} />
        </Container>,
      ]);
    } else {
      setContainers((prev) => [...prev, <Container prompt={userPrompt} />]);
    }
    setUserPrompt(() => "");

    setUserPrompt(() => "");
  };

  ////////////////////
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        console.log("Voice recognition started");
      };

      recognition.onend = () => {
        setIsListening(false);
        console.log("Voice recognition ended");
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join("");

        setUserPrompt(transcript);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
          handleGenerateVisualization(new Event("submit") as any);
        }, 2000);
      };

      recognitionRef.current = recognition;
    } else {
      console.log("Speech recognition not supported");
    }
  }, []);

  const startVoiceRecognition = () => {
    if (recognitionRef.current) {
      if (!isListening) {
        recognitionRef.current.start();
      } else {
        recognitionRef.current.stop();
      }
    }
  };
  ////////////////////

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
                type="button"
                onClick={startVoiceRecognition}
                className={`bg-gray-200 hover:bg-gray-300 ${
                  isListening ? "animate-pulse" : ""
                }`}
              >
                <Mic className="h-5 w-5 text-gray-500" />
              </Button>
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
