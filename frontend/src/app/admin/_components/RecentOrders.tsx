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
import { Clock, Eye, RefreshCcw, Truck } from "lucide-react";
import { useGetRecentOrdersQuery } from "@/app/redux/features/dashboard/dashboardApi";
import { useUpdateOrderStatusMutation } from "@/app/redux/features/order/orderApi";
import toast from "react-hot-toast";
import OrderDetailsDialog from "./OrderDetailsDialog";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="warning" className="flex items-center space-x-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    case "shipped":
      return (
        <Badge variant="default" className="flex items-center space-x-1">
          <Truck className="h-3 w-3" />
          Shipped
        </Badge>
      );
    case "delivered":
      return <Badge variant="success">Delivered</Badge>;
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function RecentOrders() {
  const { data, isLoading, error, refetch } = useGetRecentOrdersQuery();
  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();
  console.log(data);

  const handleStatusChange = async (order: any, newstatus: string) => {
    try {
      const res: any = await updateOrderStatus({
        orderId: order.id,
        status: newstatus,
      }).unwrap();

      toast.success(
        `Order ${order.orderNumber} status updated to ${newstatus}`
      );
      refetch();
    } catch (err: any) {
      console.error("Failed to update order:", err);
      toast.error("Failed to update order status.");
    }
  };

  if (isLoading) return <p>Loading recent orders...</p>;
  if (error)
    return <p className="text-red-500">Failed to load recent orders.</p>;

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold text-white">Recent Orders</CardTitle>
          <CardDescription className="text-gray-400">Latest 10 customer orders</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="bg-transparent border-white/10 text-white hover:bg-white/10 hover:text-white">
          <Eye className="h-4 w-4 mr-2" />
          View All
        </Button>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-gray-400">Order ID</TableHead>
                <TableHead className="text-gray-400">Customer Name</TableHead>
                <TableHead className="text-gray-400">Email</TableHead>
                <TableHead className="text-gray-400">Phone</TableHead>
                <TableHead className="text-gray-400">Payment Type</TableHead>
                <TableHead className="text-gray-400">Amount</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Date</TableHead>
                <TableHead className="text-gray-400">View</TableHead>
                <TableHead className="text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data?.data?.map((order: any) => (
                <TableRow key={order.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="text-gray-300">{order.orderNumber}</TableCell>
                  <TableCell className="text-gray-300">{order.customerName}</TableCell>
                  <TableCell className="text-gray-300">{order.email}</TableCell>
                  <TableCell className="text-gray-300">{order.phone}</TableCell>
                  <TableCell className="text-gray-300">{order.paymentType?.toUpperCase()}</TableCell>
                  <TableCell className="text-gray-300">Rs {order.amount?.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-gray-300">{order.date}</TableCell>
                  <TableCell>
                    <OrderDetailsDialog orderId={order.orderNumber} />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value) =>
                        handleStatusChange(order, value)
                      }
                    >
                      <SelectTrigger className="w-36 h-8">
                        <SelectValue placeholder="Change Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="dispatched">Dispatched</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
