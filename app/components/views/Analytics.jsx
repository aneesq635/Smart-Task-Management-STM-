import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, CheckCircle, Clock, Award } from 'lucide-react';

const data = [
  { name: 'Mon', completed: 12, scheduled: 15 },
  { name: 'Tue', completed: 19, scheduled: 20 },
  { name: 'Wed', completed: 15, scheduled: 18 },
  { name: 'Thu', completed: 22, scheduled: 25 },
  { name: 'Fri', completed: 18, scheduled: 20 },
  { name: 'Sat', completed: 8, scheduled: 10 },
  { name: 'Sun', completed: 5, scheduled: 5 },
];

export const Analytics = () => {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Productivity Insights</h2>
        <p className="text-gray-500 dark:text-gray-400">Track your performance over the last 7 days</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Completion Rate', value: '87%', icon: <TrendingUp className="text-green-500" />, trend: '+4.5%' },
          { label: 'Tasks Finished', value: '99', icon: <CheckCircle className="text-blue-500" />, trend: '+12' },
          { label: 'Focus Time', value: '24.5h', icon: <Clock className="text-purple-500" />, trend: '+2h' },
          { label: 'Best Streak', value: '14 Days', icon: <Award className="text-yellow-500" />, trend: 'Steady' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#1f1f1f] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg">{stat.icon}</div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 h-96">
          <h3 className="text-lg font-semibold mb-6">Task Completion</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f1f1f', border: 'none', borderRadius: '8px', color: '#fff' }}
                cursor={{ fill: '#ffffff10' }}
              />
              <Bar dataKey="completed" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 h-96">
          <h3 className="text-lg font-semibold mb-6">Efficiency Curve</h3>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="completed" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};