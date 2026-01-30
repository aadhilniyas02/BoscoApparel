"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Star, Eye, ShoppingBag } from "lucide-react"

// Mock data for top products
const topProducts = [
  {
    id: 1,
    name: "Luxury Anti-Aging Serum",
    category: "Skincare",
    price: 89.99,
    sales: 156,
    rating: 4.8,
    image: "/HeroImages/makeupimg1.jpg",
    stock: 45,
    revenue: 14036.44
  },
  {
    id: 2,
    name: "Premium Foundation Set",
    category: "Makeup",
    price: 67.50,
    sales: 134,
    rating: 4.7,
    image: "/HeroImages/makeupimg2.jpg",
    stock: 23,
    revenue: 9045.00
  },
  {
    id: 3,
    name: "Rose Gold Perfume",
    category: "Fragrance",
    price: 125.00,
    sales: 98,
    rating: 4.9,
    image: "/HeroImages/makeupimg3.jpg",
    stock: 12,
    revenue: 12250.00
  },
  {
    id: 4,
    name: "Hydrating Face Mask",
    category: "Skincare",
    price: 34.99,
    sales: 187,
    rating: 4.6,
    image: "/HeroImages/makeupimg4.jpg",
    stock: 67,
    revenue: 6543.13
  },
  {
    id: 5,
    name: "Professional Brush Set",
    category: "Makeup",
    price: 45.00,
    sales: 112,
    rating: 4.5,
    image: "/HeroImages/makeupimg5.jpg",
    stock: 34,
    revenue: 5040.00
  }
]

const getStockBadge = (stock: number) => {
  if (stock < 20) {
    return <Badge variant="destructive">Low Stock</Badge>
  } else if (stock < 50) {
    return <Badge variant="warning">Medium Stock</Badge>
  } else {
    return <Badge variant="success">In Stock</Badge>
  }
}

export function TopProducts() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Top Selling Products</CardTitle>
          <CardDescription>Best performing products this month</CardDescription>
        </div>
        <div className="flex items-center space-x-1 text-sm text-green-600">
          <TrendingUp className="h-4 w-4" />
          <span>+12.5%</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={product.id} className="flex items-center space-x-4 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900">
                    {product.name.charAt(0)}
                  </span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </h4>
                  <span className="text-xs text-gray-500">#{index + 1}</span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  <div className="flex items-center space-x-1 text-xs text-yellow-600">
                    <Star className="h-3 w-3 fill-current" />
                    <span>{product.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <ShoppingBag className="h-3 w-3" />
                      <span>{product.sales} sold</span>
                    </span>
                    <span>${product.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStockBadge(product.stock)}
                    <span className="text-xs text-gray-500">{product.stock} left</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {topProducts.reduce((sum, product) => sum + product.sales, 0)}
              </div>
              <div className="text-xs text-gray-500">Total Sales</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                ${topProducts.reduce((sum, product) => sum + product.revenue, 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Total Revenue</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {topProducts.length}
              </div>
              <div className="text-xs text-gray-500">Products</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
