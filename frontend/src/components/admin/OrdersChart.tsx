'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const data = [
  { name: 'Processing', value: 12 },
  { name: 'Shipped', value: 8 },
  { name: 'Delivered', value: 25 },
];

const COLORS = ['#9CA3AF', '#333333', '#8E1B3B']; // Gray for processing, Charcoal for shipped, Maroon for delivered

export default function OrdersChart() {
  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#333333', 
              color: '#ffffff',
              borderRadius: '2px',
              border: 'none',
              fontSize: '12px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}
            itemStyle={{ color: '#ffffff' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
            wrapperStyle={{
              fontSize: '10px',
              fontWeight: 'bold',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#9CA3AF'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
