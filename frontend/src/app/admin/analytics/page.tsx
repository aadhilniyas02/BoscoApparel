"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RevenueChart } from "@/components/admin/charts/RevenueChart"
import { CategoryChart } from "@/components/admin/charts/CategoryChart"
import { PaymentMethodChart } from "@/components/admin/charts/PaymentMethodChart"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  BarChart3,
  Calendar,
  Download,
  Filter
} from "lucide-react"

// Extended mock data for analytics
const analyticsData = {
  revenue: [
    { month: "Jan", revenue: 4000, orders: 45 },
    { month: "Feb", revenue: 3000, orders: 32 },
    { month: "Mar", revenue: 5000, orders: 58 },
    { month: "Apr", revenue: 4500, orders: 52 },
    { month: "May", revenue: 6000, orders: 67 },
    { month: "Jun", revenue: 5500, orders: 61 },
  ],
  categories: [
    { name: "Skincare", value: 35, color: "#8884d8", revenue: 45000 },
    { name: "Makeup", value: 28, color: "#82ca9d", revenue: 36000 },
    { name: "Fragrance", value: 20, color: "#ffc658", revenue: 25000 },
    { name: "Hair Care", value: 17, color: "#ff7300", revenue: 21000 },
  ],
  paymentMethods: [
    { name: "Credit Card", value: 45, color: "#8884d8" },
    { name: "PayPal", value: 30, color: "#82ca9d" },
    { name: "Bank Transfer", value: 15, color: "#ffc658" },
    { name: "Cash on Delivery", value: 10, color: "#ff7300" },
  ],
  topProducts: [
    { name: "Luxury Anti-Aging Serum", sales: 156, revenue: 14036.44, growth: 12.5 },
    { name: "Premium Foundation Set", sales: 134, revenue: 9045.00, growth: 8.3 },
    { name: "Rose Gold Perfume", sales: 98, revenue: 12250.00, growth: 15.2 },
    { name: "Hydrating Face Mask", sales: 187, revenue: 6543.13, growth: -2.1 },
    { name: "Professional Brush Set", sales: 112, revenue: 5040.00, growth: 5.7 },
  ],
  customerSegments: [
    { segment: "New Customers", count: 234, percentage: 35, revenue: 15600 },
    { segment: "Returning Customers", count: 289, percentage: 43, revenue: 28900 },
    { segment: "VIP Customers", count: 147, percentage: 22, revenue: 44100 },
  ]
}

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights into your business performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="6months">
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-900">$127,500</p>
                <p className="text-xs text-blue-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% from last month
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Total Orders</p>
                <p className="text-2xl font-bold text-green-900">1,247</p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.2% from last month
                </p>
              </div>
              <ShoppingBag className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Active Customers</p>
                <p className="text-2xl font-bold text-purple-900">892</p>
                <p className="text-xs text-purple-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5.1% from last month
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Avg Order Value</p>
                <p className="text-2xl font-bold text-orange-900">$102.31</p>
                <p className="text-xs text-orange-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +3.2% from last month
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Orders Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Revenue & Orders Trend</span>
            </CardTitle>
            <CardDescription>
              Monthly revenue and order volume over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart data={analyticsData.revenue} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-green-600" />
              <span>Category Performance</span>
            </CardTitle>
            <CardDescription>
              Sales distribution across product categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryChart data={analyticsData.categories} />
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <span>Payment Methods</span>
            </CardTitle>
            <CardDescription>
              Customer payment preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentMethodChart data={analyticsData.paymentMethods} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <span>Top Performing Products</span>
            </CardTitle>
            <CardDescription>
              Best selling products this period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-900">#{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{product.name}</h4>
                      <p className="text-xs text-gray-500">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">${product.revenue.toLocaleString()}</p>
                    <div className={`flex items-center text-xs ${product.growth > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {product.growth > 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(product.growth)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Segments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-indigo-600" />
            <span>Customer Segments</span>
          </CardTitle>
          <CardDescription>
            Customer distribution and revenue contribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analyticsData.customerSegments.map((segment) => (
              <div key={segment.segment} className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{segment.segment}</h4>
                  <Badge variant="outline">{segment.percentage}%</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Customers:</span>
                    <span className="font-medium">{segment.count}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-medium">${segment.revenue.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${segment.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
