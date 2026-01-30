"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ShoppingBag,
  DollarSign,
  Users,
  UserPlus,
  Shield
} from "lucide-react"
import { useState } from "react"

// Mock data for customers
const customers = [
  {
    id: "CUST-001",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    joinDate: "2023-06-15",
    lastLogin: "2024-01-15",
    status: "active",
    totalOrders: 12,
    totalSpent: 1247.89,
    location: "New York, NY",
    tier: "Gold"
  },
  {
    id: "CUST-002",
    name: "Emily Chen",
    email: "emily.chen@email.com",
    phone: "+1 (555) 234-5678",
    joinDate: "2023-08-22",
    lastLogin: "2024-01-14",
    status: "active",
    totalOrders: 8,
    totalSpent: 892.45,
    location: "Los Angeles, CA",
    tier: "Silver"
  },
  {
    id: "CUST-003",
    name: "Michael Brown",
    email: "michael.brown@email.com",
    phone: "+1 (555) 345-6789",
    joinDate: "2023-09-10",
    lastLogin: "2024-01-13",
    status: "active",
    totalOrders: 15,
    totalSpent: 2156.78,
    location: "Chicago, IL",
    tier: "Platinum"
  },
  {
    id: "CUST-004",
    name: "Jessica Davis",
    email: "jessica.davis@email.com",
    phone: "+1 (555) 456-7890",
    joinDate: "2023-11-05",
    lastLogin: "2024-01-12",
    status: "inactive",
    totalOrders: 3,
    totalSpent: 234.50,
    location: "Houston, TX",
    tier: "Bronze"
  },
  {
    id: "CUST-005",
    name: "David Wilson",
    email: "david.wilson@email.com",
    phone: "+1 (555) 567-8901",
    joinDate: "2023-12-18",
    lastLogin: "2024-01-11",
    status: "banned",
    totalOrders: 5,
    totalSpent: 445.25,
    location: "Phoenix, AZ",
    tier: "Bronze"
  },
  {
    id: "CUST-006",
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    phone: "+1 (555) 678-9012",
    joinDate: "2024-01-02",
    lastLogin: "2024-01-15",
    status: "active",
    totalOrders: 6,
    totalSpent: 678.90,
    location: "Miami, FL",
    tier: "Silver"
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge variant="success" className="flex items-center space-x-1"><UserCheck className="h-3 w-3" />Active</Badge>
    case "inactive":
      return <Badge variant="warning" className="flex items-center space-x-1"><UserX className="h-3 w-3" />Inactive</Badge>
    case "banned":
      return <Badge variant="destructive" className="flex items-center space-x-1"><Shield className="h-3 w-3" />Banned</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const getTierBadge = (tier: string) => {
  switch (tier) {
    case "Platinum":
      return <Badge variant="default" className="bg-gradient-to-r from-purple-600 to-indigo-600">Platinum</Badge>
    case "Gold":
      return <Badge variant="default" className="bg-gradient-to-r from-yellow-500 to-orange-500">Gold</Badge>
    case "Silver":
      return <Badge variant="secondary" className="bg-gradient-to-r from-gray-400 to-gray-500 text-white">Silver</Badge>
    case "Bronze":
      return <Badge variant="outline" className="border-amber-600 text-amber-600">Bronze</Badge>
    default:
      return <Badge variant="outline">{tier}</Badge>
  }
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tierFilter, setTierFilter] = useState("all")

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    const matchesTier = tierFilter === "all" || customer.tier === tierFilter
    return matchesSearch && matchesStatus && matchesTier
  })

  const totalCustomers = customers.length
  const activeCustomers = customers.filter(customer => customer.status === "active").length
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0)
  const averageOrderValue = totalRevenue / customers.reduce((sum, customer) => sum + customer.totalOrders, 0)

  const handleStatusChange = (customerId: string, newStatus: string) => {
    console.log(`Customer ${customerId} status changed to ${newStatus}`)
    // Here you would typically make an API call to update the customer status
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">Manage and monitor customer accounts</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-green-600">{activeCustomers}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-purple-600">${totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-orange-600">${averageOrderValue.toFixed(2)}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search customers, emails, or IDs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                </SelectContent>
              </Select>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="w-40">
                  <Shield className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="Platinum">Platinum</SelectItem>
                  <SelectItem value="Gold">Gold</SelectItem>
                  <SelectItem value="Silver">Silver</SelectItem>
                  <SelectItem value="Bronze">Bronze</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span>{customer.location}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getTierBadge(customer.tier)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <ShoppingBag className="h-4 w-4 text-gray-400" />
                      <span>{customer.totalOrders}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">${customer.totalSpent.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(customer.status)}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(customer.joinDate).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(customer.lastLogin).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Select 
                        value={customer.status} 
                        onValueChange={(value) => handleStatusChange(customer.id, value)}
                      >
                        <SelectTrigger className="w-28 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="banned">Ban</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
