"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  DollarSign,
  Activity,
  Eye,
  Star
} from "lucide-react"
import { RevenueChart } from "@/components/admin/charts/RevenueChart"
import { CategoryChart } from "@/components/admin/charts/CategoryChart"
import { PaymentMethodChart } from "@/components/admin/charts/PaymentMethodChart"
import { RecentOrders } from "@/app/admin/_components/RecentOrders"
import { useGetGraphStatsQuery } from "../redux/features/dashboard/dashboardApi"
import DashboardStats from "./_components/DashboardStats"
import DashboardCharts from "./_components/DashboardCharts"

// Mock data for demonstration
const statsData = {
  totalSales: {
    daily: 2450,
    monthly: 89500,
    yearly: 1250000,
    change: "+12.5%"
  },
  totalOrders: 1247,
  activeCustomers: 892,
  topSellingProducts: 156,
  revenue: [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 5000 },
    { month: "Apr", revenue: 4500 },
    { month: "May", revenue: 6000 },
    { month: "Jun", revenue: 5500 },
  ],
  categories: [
    { name: "Skincare", value: 35, color: "#8884d8" },
    { name: "Makeup", value: 28, color: "#82ca9d" },
    { name: "Fragrance", value: 20, color: "#ffc658" },
    { name: "Hair Care", value: 17, color: "#ff7300" },
  ],
  paymentMethods: [
    { name: "Credit Card", value: 45, color: "#8884d8" },
    { name: "PayPal", value: 30, color: "#82ca9d" },
    { name: "Bank Transfer", value: 15, color: "#ffc658" },
    { name: "Cash on Delivery", value: 10, color: "#ff7300" },
  ]
}

export default function AdminDashboard() {

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">{"Welcome back! Here's what's happening with your Clothing Manufacturing Garment"}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      <DashboardCharts />

      {/* Recent Orders and Top Products */}
      <div className="w-full">
        <RecentOrders />

      </div>
    </div>
  )
}
