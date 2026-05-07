'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Jan', revenue: 2400 },
  { name: 'Feb', revenue: 3100 },
  { name: 'Mar', revenue: 2800 },
  { name: 'Apr', revenue: 4200 },
  { name: 'May', revenue: 3800 },
  { name: 'Jun', revenue: 5300 },
];

export default function RevenueChart() {
  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8E1B3B" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8E1B3B" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }}
            tickFormatter={(value) => `RM${value}`}
          />
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
            formatter={(value: any) => [`RM ${Number(value).toFixed(2)}`, 'Revenue']}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#8E1B3B"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            activeDot={{ r: 6, fill: '#8E1B3B', stroke: '#ffffff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
