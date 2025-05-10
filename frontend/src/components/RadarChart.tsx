import React, { PureComponent } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const data2 = [
  {
    subject: 'Food',
    A: 120,
    B: 110,
    fullMark: 150,
  },
  {
    subject: 'Culture',
    A: 98,
    B: 130,
    fullMark: 150,
  },
  {
    subject: 'Clothing',
    A: 86,
    B: 130,
    fullMark: 150,
  },
  {
    subject: 'School',
    A: 99,
    B: 100,
    fullMark: 150,
  },
  {
    subject: 'Housing',
    A: 85,
    B: 90,
    fullMark: 150,
  },
  {
    subject: 'Plants',
    A: 65,
    B: 85,
    fullMark: 150,
  },
];

type RadarChartData = {
  subject: string,
  A: number,
  B: number,
  fullMark: number,
};

interface RadarChartProps  {
  data?: RadarChartData[];
};



export default class RadarChartContainer extends PureComponent<RadarChartProps> {
  render() {
    const data = this.props.data || data2;
    return (
    <div className="bg-white rounded-xl p-6 animate-fade-in">
      <h3 className="text-lg text-gray-700 font-bold">
        Radar Chart
      </h3>
      <p className="text-gray-500">One of the simplest ways to indetify bottlenecks</p>

      <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis />
          <Radar name="Mike" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
      </div>
    </div>
    );
  }
}