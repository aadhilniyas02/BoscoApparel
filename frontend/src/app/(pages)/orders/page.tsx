'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Truck, CheckCircle, Clock, Eye, Download, Search } from 'lucide-react';
import { useState } from 'react';

// Static past orders data
const pastOrders = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    amount: 149.99,
    status: 'delivered',
    items: 2,
    trackingNumber: 'TRK-123456',
    deliveryDate: '2024-01-18',
    shippingAddress: 'New York, NY',
    itemsDetails: ['Wireless Headphones', 'Phone Case (x2)']
  },
  {
    id: 'ORD-002',
    date: '2024-01-22',
    amount: 89.99,
    status: 'delivered',
    items: 1,
    trackingNumber: 'TRK-789012',
    deliveryDate: '2024-01-25',
    shippingAddress: 'New York, NY',
    itemsDetails: ['Bluetooth Speaker']
  },
  {
    id: 'ORD-003',
    date: '2024-02-05',
    amount: 299.99,
    status: 'shipped',
    items: 3,
    trackingNumber: 'TRK-345678',
    deliveryDate: null,
    shippingAddress: 'New York, NY',
    itemsDetails: ['Gaming Keyboard', 'Gaming Mouse', 'Mouse Pad']
  },
  {
    id: 'ORD-004',
    date: '2024-02-12',
    amount: 199.99,
    status: 'processing',
    items: 1,
    trackingNumber: null,
    deliveryDate: null,
    shippingAddress: 'New York, NY',
    itemsDetails: ['Wireless Charger']
  },
  {
    id: 'ORD-005',
    date: '2024-02-18',
    amount: 79.99,
    status: 'delivered',
    items: 2,
    trackingNumber: 'TRK-901234',
    deliveryDate: '2024-02-21',
    shippingAddress: 'New York, NY',
    itemsDetails: ['USB Cable (x2)', 'Screen Cleaner']
  },
  {
    id: 'ORD-006',
    date: '2024-03-01',
    amount: 449.99,
    status: 'cancelled',
    items: 1,
    trackingNumber: null,
    deliveryDate: null,
    shippingAddress: 'New York, NY',
    itemsDetails: ['Laptop Stand']
  },
  {
    id: 'ORD-007',
    date: '2024-03-10',
    amount: 129.99,
    status: 'delivered',
    items: 3,
    trackingNumber: 'TRK-567890',
    deliveryDate: '2024-03-13',
    shippingAddress: 'New York, NY',
    itemsDetails: ['Phone Screen Protector', 'Car Mount', 'Cable Organizer']
  },
  {
    id: 'ORD-008',
    date: '2024-03-15',
    amount: 59.99,
    status: 'shipped',
    items: 1,
    trackingNumber: 'TRK-111222',
    deliveryDate: null,
    shippingAddress: 'New York, NY',
    itemsDetails: ['Portable Charger']
  }
];

export default function PastOrdersTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'shipped': return <Truck className="h-4 w-4 text-blue-600" />;
      case 'processing': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'cancelled': return <Package className="h-4 w-4 text-red-600" />;
      default: return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      delivered: 'bg-green-100 text-green-800',
      shipped: 'bg-blue-100 text-blue-800',
      processing: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge variant="secondary" className={statusConfig[status as keyof typeof statusConfig]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredOrders = pastOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.itemsDetails.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAmount = pastOrders.reduce((sum, order) => sum + order.amount, 0);
  const deliveredOrders = pastOrders.filter(order => order.status === 'delivered').length;

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Past Orders</h1>
          <p className="text-muted-foreground">View and manage your order history</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pastOrders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveredOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <div className="text-xs text-muted-foreground">$</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders or items..."
                className="w-full pl-10 pr-4 py-2 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2 border rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="delivered">Delivered</option>
              <option value="shipped">Shipped</option>
              <option value="processing">Processing</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Order ID</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Items</th>
                  <th className="text-left py-3 px-4 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Tracking</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="font-medium">{order.id}</div>
                      <div className="text-sm text-muted-foreground">{order.shippingAddress}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div>{new Date(order.date).toLocaleDateString()}</div>
                      {order.deliveryDate && (
                        <div className="text-sm text-muted-foreground">
                          Delivered: {new Date(order.deliveryDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium">{order.items} item{order.items > 1 ? 's' : ''}</div>
                      <div className="text-sm text-muted-foreground max-w-xs truncate">
                        {order.itemsDetails.join(', ')}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium">
                      ${order.amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <StatusIcon status={order.status} />
                        {getStatusBadge(order.status)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {order.trackingNumber ? (
                        <div className="font-mono text-sm">{order.trackingNumber}</div>
                      ) : (
                        <div className="text-sm text-muted-foreground">-</div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        {order.status === 'delivered' && (
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No orders found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}