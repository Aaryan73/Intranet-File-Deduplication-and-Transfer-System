import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { date: '2024-09-01', bandwidthSaved: 500 },
  { date: '2024-09-02', bandwidthSaved: 450 },
  { date: '2024-09-03', bandwidthSaved: 600 },
  { date: '2024-09-04', bandwidthSaved: 700 },
  { date: '2024-09-05', bandwidthSaved: 650 },
  { date: '2024-09-06', bandwidthSaved: 750 },
  { date: '2024-09-07', bandwidthSaved: 800 }
];

export default function BandwidthSavedChart() {
  return (
    <div className="h-[22rem] bg-gray-800 p-4 rounded-sm border border-gray-800 flex flex-col flex-1">
      <strong className="text-gray-200 font-medium">Bandwidth Saved</strong>
      <div className="mt-3 w-full flex-1 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 20,
              right: 10,
              left: 0,
              bottom: 0
            }}
          >
            <CartesianGrid stroke="#444" strokeDasharray="5 5" />
            <XAxis dataKey="date" axisLine={{ stroke: '#555' }} tick={{ fill: '#ccc' }} />
            <YAxis axisLine={{ stroke: '#555' }} tick={{ fill: '#ccc' }} />
            <Tooltip contentStyle={{ backgroundColor: '#222', color: '#ddd' }} />
            <Legend wrapperStyle={{ color: '#ccc' }} />
            <Line
              type="linear"
              dataKey="bandwidthSaved"
              stroke="#0ea5e9"
              strokeWidth={3}
              dot={{ stroke: '#0ea5e9', strokeWidth: 2, r: 5 }}
              activeDot={{ stroke: '#0ea5e9', strokeWidth: 2, r: 7 }}
              strokeLinecap="round"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
