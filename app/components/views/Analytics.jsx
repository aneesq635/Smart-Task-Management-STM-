"use client";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { TrendingUp, CheckCircle, Clock, Award, Loader2 } from "lucide-react";
import { useAuth } from "../AuthContext";
// import { fetchAnalytics } from "../services/analyticsService";

export const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const userId = user?.id;
  useEffect(() => {
    loadAnalytics();
  }, [userId]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/analytics?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error("Fetch analytics error:", error);
      setAnalyticsData({
        weeklyData: [],
        stats: {
          completionRate: "0%",
          tasksFinished: 0,
          focusTime: "0h",
          bestStreak: "0 Days",
          trend: {
            completionRate: "+0%",
            tasksFinished: "+0",
            focusTime: "+0h",
            bestStreak: "Start",
          },
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Failed to load analytics</p>
      </div>
    );
  }

  const { weeklyData, stats } = analyticsData;

  const statsConfig = [
    {
      label: "Completion Rate",
      value: stats.completionRate,
      icon: <TrendingUp className="text-green-500" />,
      trend: stats.trend.completionRate,
    },
    {
      label: "Tasks Finished",
      value: stats.tasksFinished.toString(),
      icon: <CheckCircle className="text-blue-500" />,
      trend: stats.trend.tasksFinished,
    },
    {
      label: "Focus Time",
      value: stats.focusTime,
      icon: <Clock className="text-purple-500" />,
      trend: stats.trend.focusTime,
    },
    {
      label: "Best Streak",
      value: stats.bestStreak,
      icon: <Award className="text-yellow-500" />,
      trend: stats.trend.bestStreak,
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Productivity Insights
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Track your performance over the last 7 days
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsConfig.map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#1f1f1f] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                {stat.icon}
              </div>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${
                  stat.trend.startsWith("+") || stat.trend === "Improving"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {stat.trend}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 h-96">
          <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
            Task Completion
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={weeklyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#333"
              />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f1f1f",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                cursor={{ fill: "#ffffff10" }}
              />
              <Bar
                dataKey="completed"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                barSize={32}
              />
              <Bar
                dataKey="scheduled"
                fill="#64748b"
                radius={[4, 4, 0, 0]}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 h-96">
          <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
            Efficiency Curve
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f1f1f",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorValue)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={loadAnalytics}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
};
