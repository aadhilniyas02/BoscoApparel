"use client";

import { useGetGraphStatsQuery } from "@/app/redux/features/dashboard/dashboardApi";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { TrendingUp, Package, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export default function DashboardCharts() {
  const { data, isLoading, error } = useGetGraphStatsQuery(undefined);
  console.log(data)

  if (isLoading) return <p className="text-center text-gray-500">Loading charts...</p>;
  if (error) return <p className="text-center text-red-500">Failed to load chart data.</p>;

  const stats = data?.data || {};
  const revenueData = stats.revenue || [];
  const categoryData = stats.categories || [];
  const paymentData = stats.paymentMethods || [];

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#a855f7"];

  return (
    <div className="space-y-6">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* 📈 Revenue Over Time */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <TrendingUp className="h-5 w-5 text-white" />
              <span>Revenue Over Time</span>
            </CardTitle>
            <CardDescription className="text-gray-400">Monthly revenue trends for the past months</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '0.5rem', color: '#fff' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 🛍️ Product Categories */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Package className="h-5 w-5 text-white" />
              <span>Product Categories</span>
            </CardTitle>
            <CardDescription className="text-gray-400">Sales distribution across product categories</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {categoryData.map((entry: { name: string; value: number; color?: string }, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '0.5rem', color: '#fff' }}
                />
                <Legend className="text-gray-400" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 💳 Payment Method Distribution */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Activity className="h-5 w-5 text-white" />
            <span>Payment Method Distribution</span>
          </CardTitle>
          <CardDescription className="text-gray-400">Breakdown of payment methods used by customers</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={paymentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label
              >
                {paymentData.map((entry: { name: string; value: number; color?: string }, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '0.5rem', color: '#fff' }}
              />
              <Legend className="text-gray-400" />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
