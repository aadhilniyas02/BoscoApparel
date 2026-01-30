"use client";

import { useParams } from "next/navigation";
import { CheckCircle, Package, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetOrderByIdQuery } from "@/app/redux/features/order/orderApi";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";
interface ProductType {
  _id: string;
  name: string;
  price: number;
  images?: { url: string }[];
}

interface OrderItemType {
  productId: ProductType;
  qty: number;
}

interface OrderType {
  _id: string;
  orderNumber: string;
  items: OrderItemType[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentType: "cod" | "bank";
  paymentStatus: "pending" | "paid" | "failed";
  status: string;
  shippingData?: any;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const { data, isLoading, isError } = useGetOrderByIdQuery(orderId, {
    skip: !orderId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-gray-400">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-white">
            Order Not Found
          </h2>
          <p className="mt-2 text-gray-400">
            {"We couldn't find the order you're looking for."}
          </p>
          <Link href="/" className="mt-6 inline-block">
            <Button className="px-6 py-3">Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const order = data.data as OrderType;
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Order number copied!");
    } catch (error) {
      toast.error("Failed to copy!");
    }
  };
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-400">Thank you for your purchase</p>
        </div>

        {/* Order Number Card */}
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-white/10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-400">Order Number:</span>
              <span className="text-2xl font-bold text-white">
                #{order.orderNumber}
              </span>
              <button
                onClick={() => handleCopy(order.orderNumber)}
                className="p-1 hover:bg-white/10 rounded-full transition"
                title="Copy Order Number"
              >
                <Copy size={18} className="text-gray-400 hover:text-blue-400" />
              </button>
            </div>
            <div className="px-4 py-2 bg-green-500/20 rounded-full">
              <span className="text-green-400 font-semibold capitalize">
                {order.status}
              </span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 mb-6 border border-white/10">
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-white">Order Summary</h2>
          </div>

          {/* Items */}
          <div className="space-y-4 mb-6">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5"
              >
                <img
                  src={item.productId?.images?.[0]?.url || "/HeroImages/defaultimg.png"}
                  alt={item.productId?.name || "Product"}
                  className="w-20 h-20 object-cover rounded-lg shadow-sm"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg">
                    {item.productId?.name || "Product"}
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    Quantity: {item.qty}
                  </p>

                  {item.productId?.price && (
                    <p className="text-sm font-medium text-gray-300 mt-1">
                      Rs. {item.productId.price} × {item.qty} = Rs.{" "}
                      {item.productId.price * item.qty}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-white/10 pt-4 space-y-3">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span className="font-medium">Rs. {order.subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Shipping</span>
              <span className="font-medium">Rs. {order.shipping}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-white pt-3 border-t border-white/10">
              <span>Total</span>
              <span>Rs. {order.total}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">Payment Method</p>
                <p className="font-semibold text-white capitalize">
                  {order.paymentType === "cod"
                    ? "Cash on Delivery"
                    : "Bank Transfer"}
                </p>
              </div>
              {order.paymentType !== "cod" && (
                <div className="text-right">
                  <p className="text-sm text-gray-400">Payment Status</p>
                  <p className="font-semibold text-white capitalize">
                    {order.paymentStatus}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/products" className="flex-1">
            <Button
              variant="outline"
              className="w-full h-12 text-base font-semibold rounded-xl shadow hover:shadow-lg transition-all border-white/10 text-white hover:bg-white/10 hover:text-white"
            >
              Continue Shopping
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button className="w-full h-12 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-400 bg-black/40 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/10">
          <p>
            Your order has been successfully placed and is now being processed.
          </p>
          <p className="mt-2">
            For any updates or to check your order status, please contact our
            support team via WhatsApp or email.
          </p>
        </div>
      </div>
    </div>
  );
}
