"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/app/redux/features/order/orderApi";
import OrderDetailsDialog from "../_components/OrderDetailsDialog";
import { Input } from "@/components/ui/input";

// 🔹 Utility for status badges
const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="warning" className="flex items-center space-x-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    case "processing":
    case "shipped":
      return (
        <Badge variant="default" className="flex items-center space-x-1">
          <Truck className="h-3 w-3" />
          {status === "shipped" ? "Shipped" : "Processing"}
        </Badge>
      );
    case "delivered":
      return (
        <Badge variant="success" className="flex items-center space-x-1">
          <CheckCircle className="h-3 w-3" />
          Delivered
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="destructive" className="flex items-center space-x-1">
          <XCircle className="h-3 w-3" />
          Cancelled
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const { data, isLoading, error, refetch } = useGetAllOrdersQuery({
    status: statusFilter === "all" ? undefined : statusFilter,
    search: searchTerm,
    page,
    limit,
  });

  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const orders = data?.data || [];
  const pagination = data?.pagination || {};

  // 🔹 Refetch when filters change
  useEffect(() => {
    refetch();
  }, [statusFilter, page, searchTerm, refetch]);

  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;
    return orders.filter((order: any) =>
      [order.customerName, order.email, order.orderNumber]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [orders, searchTerm]);

  // 🔹 Handle status update
  const handleStatusChange = async (order: any, newStatus: string) => {
    try {
      await updateOrderStatus({
        orderId: order.id,
        status: newStatus,
      }).unwrap();
      toast.success(`Order ${order.orderNumber} updated to ${newStatus}`);
      refetch();
    } catch (err) {
      console.error("Failed to update:", err);
      toast.error("Failed to update order status.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Order Management</h1>
          <p className="text-gray-400">
            Manage, track, and update customer orders.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Main Orders Table */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-lg font-semibold text-white">Orders List</CardTitle>
              <CardDescription className="text-gray-400">
                Page {pagination.page || 1} of {pagination.pages || 1}
              </CardDescription>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or order number..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>

              {/* Status Filter */}
              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        {/* Table Content */}
        <CardContent>
          {isLoading ? (
            <p className="text-center text-gray-500 py-6">Loading orders...</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-gray-400">Order ID</TableHead>
                    <TableHead className="text-gray-400">Customer</TableHead>
                    <TableHead className="text-gray-400">Email</TableHead>
                    <TableHead className="text-gray-400">Phone</TableHead>
                    <TableHead className="text-gray-400">Payment</TableHead>
                    <TableHead className="text-gray-400">Amount</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Date</TableHead>
                    <TableHead className="text-gray-400">View</TableHead>
                    <TableHead className="text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order: any) => (
                      <TableRow key={order.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-gray-300">{order.orderNumber}</TableCell>
                        <TableCell className="text-gray-300">{order.customerName}</TableCell>
                        <TableCell className="text-gray-300">{order.email}</TableCell>
                        <TableCell className="text-gray-300">{order.phone}</TableCell>
                        <TableCell className="text-gray-300">
                          {order.paymentType?.toUpperCase() || "N/A"}
                        </TableCell>
                        <TableCell className="text-gray-300">LKR {order.amount?.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-gray-300">
                          {new Date(order.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <OrderDetailsDialog orderId={order?.orderNumber} />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(value) =>
                              handleStatusChange(order, value)
                            }
                          >
                            <SelectTrigger className="w-36 h-8 bg-white/5 border-white/10 text-white">
                              <SelectValue placeholder="Change Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">
                                Processing
                              </SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="text-center py-6 text-gray-500"
                      >
                        No matching orders found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrevPage}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <span className="text-sm text-gray-600">
              Page {pagination.page || 1} of {pagination.pages || 1}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNextPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
