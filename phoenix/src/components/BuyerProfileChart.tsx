import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, LabelProps } from 'recharts';

// Define the type for your data
interface DataItem {
  name: string;
  value: number;
}

// Data for the PieChart
const data: DataItem[] = [
  { name: 'Images', value: 540 },
  { name: 'PDF', value: 620 },
  { name: 'Video', value: 210 }
];

const RADIAN = Math.PI / 180;
const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

// Type for the customized label props
interface CustomizedLabelProps extends LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

// Customized label component
const renderCustomizedLabel: React.FC<CustomizedLabelProps> = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="#ffffff" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const BuyerProfilePieChart: React.FC = () => {
  return (
    <div className="w-[20rem] h-[22rem] bg-gray-800 p-4 rounded-sm border border-gray-700 flex flex-col">
      <strong className="text-gray-200 font-medium">File Categories</strong>
      <div className="mt-3 w-full flex-1 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={300}>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={105}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend wrapperStyle={{ color: '#ddd' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BuyerProfilePieChart;
