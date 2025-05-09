
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "Stocks", value: 60 },
  { name: "Bonds", value: 15 },
  { name: "ETFs", value: 20 },
  { name: "Crypto", value: 5 },
];

const COLORS = ["#9b87f5", "#1A1F2C", "#4CAF50", "#ea384c"];

const AssetDistribution = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 animate-slide-in">
      <h3 className="text-lg text-gray-500 mb-4">Asset Distribution</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              iconType="circle"
              formatter={(value) => <span style={{ color: '#444', fontSize: '14px' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AssetDistribution;
