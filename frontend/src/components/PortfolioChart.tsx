import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";

const mockData = [
  { name: "Jan", value: 5000 },
  { name: "Feb", value: 5400 },
  { name: "Mar", value: 5200 },
  { name: "Apr", value: 6100 },
  { name: "May", value: 6800 },
  { name: "Jun", value: 7400 },
  { name: "Jul", value: 7304 },
];

const timeRanges = ["1D", "1W", "1M", "3M", "1Y", "All"];

const PortfolioChart = () => {
  const [selectedRange, setSelectedRange] = useState("1Y");
  const profit = mockData[mockData.length - 1].value - mockData[0].value;
  const profitPercentage = ((profit / mockData[0].value) * 100).toFixed(2);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg text-gray-500">Portfolio Value</h3>
          <p className="text-3xl font-bold">
            ${mockData[mockData.length - 1].value.toLocaleString()}
          </p>
          <div
            className={`flex items-center mt-1 ${profit >= 0 ? "text-traderepublic-green" : "text-traderepublic-red"}`}
          >
            <span className="font-medium">
              {profit >= 0 ? "+" : ""}
              {profit.toLocaleString()} $
            </span>
            <span className="ml-2">
              ({profit >= 0 ? "+" : ""}
              {profitPercentage}%)
            </span>
          </div>
        </div>
      </div>

      <div className="h-64 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={mockData}
            margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
          >
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#888", fontSize: 12 }}
            />
            <YAxis hide={true} domain={["dataMin - 500", "dataMax + 500"]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1F2C",
                border: "none",
                borderRadius: "8px",
                padding: "10px",
              }}
              itemStyle={{ color: "#fff" }}
              labelStyle={{
                color: "#9b87f5",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
              formatter={(value) => [`€${value}`, "Value"]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#9b87f5"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: "#9b87f5" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center mt-4 gap-2">
        {timeRanges.map((range) => (
          <Button
            key={range}
            variant={selectedRange === range ? "default" : "outline"}
            className={`px-4 py-1 h-8 ${
              selectedRange === range
                ? "bg-traderepublic-purple hover:bg-traderepublic-darkpurple"
                : "text-gray-600 hover:text-traderepublic-purple"
            }`}
            onClick={() => setSelectedRange(range)}
          >
            {range}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PortfolioChart;
