"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Bell, 
  AlertTriangle, 
  Package, 
  ShoppingBag, 
  Users, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  MessageSquare
} from "lucide-react"
import { useState } from "react"

// Mock data for notifications
const notifications = [
  {
    id: 1,
    type: "low-stock",
    title: "Low Stock Alert",
    message: "Luxury Anti-Aging Serum is running low (12 items left)",
    priority: "high",
    timestamp: "2024-01-15T10:30:00Z",
    read: false,
    action: "restock"
  },
  {
    id: 2,
    type: "new-order",
    title: "New Order Received",
    message: "Order ORD-006 received from Sarah Johnson for $89.99",
    priority: "medium",
    timestamp: "2024-01-15T09:15:00Z",
    read: false,
    action: "view-order"
  },
  {
    id: 3,
    type: "payment-failed",
    title: "Payment Failed",
    message: "Payment for Order ORD-007 failed. Customer: Emily Chen",
    priority: "high",
    timestamp: "2024-01-15T08:45:00Z",
    read: true,
    action: "retry-payment"
  },
  {
    id: 4,
    type: "high-sales",
    title: "High Sales Alert",
    message: "Sales increased by 25% this week compared to last week",
    priority: "low",
    timestamp: "2024-01-14T16:20:00Z",
    read: true,
    action: "view-analytics"
  },
  {
    id: 5,
    type: "customer-review",
    title: "New Customer Review",
    message: "5-star review received for Premium Foundation Set",
    priority: "low",
    timestamp: "2024-01-14T14:10:00Z",
    read: true,
    action: "view-review"
  },
  {
    id: 6,
    type: "out-of-stock",
    title: "Product Out of Stock",
    message: "Professional Brush Set is now out of stock",
    priority: "high",
    timestamp: "2024-01-14T11:30:00Z",
    read: false,
    action: "restock"
  },
  {
    id: 7,
    type: "new-customer",
    title: "New Customer Registration",
    message: "New customer Lisa Anderson registered with Gold tier",
    priority: "low",
    timestamp: "2024-01-14T10:05:00Z",
    read: true,
    action: "view-customer"
  },
  {
    id: 8,
    type: "system-maintenance",
    title: "Scheduled Maintenance",
    message: "System maintenance scheduled for tonight at 2:00 AM",
    priority: "medium",
    timestamp: "2024-01-14T09:00:00Z",
    read: false,
    action: "view-details"
  }
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "low-stock":
    case "out-of-stock":
      return <Package className="h-5 w-5 text-yellow-600" />
    case "new-order":
      return <ShoppingBag className="h-5 w-5 text-blue-600" />
    case "payment-failed":
      return <XCircle className="h-5 w-5 text-red-600" />
    case "high-sales":
      return <TrendingUp className="h-5 w-5 text-green-600" />
    case "customer-review":
      return <Star className="h-5 w-5 text-yellow-500" />
    case "new-customer":
      return <Users className="h-5 w-5 text-purple-600" />
    case "system-maintenance":
      return <Clock className="h-5 w-5 text-orange-600" />
    default:
      return <Bell className="h-5 w-5 text-gray-600" />
  }
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge variant="destructive">High</Badge>
    case "medium":
      return <Badge variant="warning">Medium</Badge>
    case "low":
      return <Badge variant="success">Low</Badge>
    default:
      return <Badge variant="outline">{priority}</Badge>
  }
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all")
  const [notificationsState, setNotificationsState] = useState(notifications)

  const filteredNotifications = notificationsState.filter(notification => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.read
    return notification.priority === filter
  })

  const unreadCount = notificationsState.filter(n => !n.read).length
  const highPriorityCount = notificationsState.filter(n => n.priority === "high" && !n.read).length

  const markAsRead = (id: number) => {
    setNotificationsState(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotificationsState(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with important alerts and updates</p>
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                <p className="text-2xl font-bold text-gray-900">{notificationsState.length}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-orange-600">{unreadCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600">{highPriorityCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Read</p>
                <p className="text-2xl font-bold text-green-600">{notificationsState.length - unreadCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={filter === "all" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button 
              variant={filter === "unread" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("unread")}
            >
              Unread
            </Button>
            <Button 
              variant={filter === "high" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("high")}
            >
              High Priority
            </Button>
            <Button 
              variant={filter === "medium" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("medium")}
            >
              Medium Priority
            </Button>
            <Button 
              variant={filter === "low" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("low")}
            >
              Low Priority
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 rounded-lg border transition-colors ${
                  notification.read ? 'bg-gray-50' : 'bg-white border-blue-200'
                } hover:bg-gray-100 cursor-pointer`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {getPriorityBadge(notification.priority)}
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {notification.message}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(notification.timestamp).toLocaleString()}
                      </span>
                      <Button variant="ghost" size="sm" className="text-xs">
                        {notification.action.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Button>
                    </div>
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
