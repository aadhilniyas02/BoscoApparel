import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useGetOrderByIdQuery } from "@/app/redux/features/order/orderApi";
import {
  Package,
  CreditCard,
  MapPin,
  Mail,
  Phone,
  Calendar,
  User,
  ShoppingCart,
  Loader2,
  Tag,
  Percent,
} from "lucide-react";

function OrderDetailsDialog({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);

  const { data, isLoading, error } = useGetOrderByIdQuery(orderId, {
    skip: !open || !orderId,
  });

  const order = data?.data;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      completed: "bg-green-500/10 text-green-500 border-green-500/20",
      cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
      shipped: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    };
    return (
      colors[status?.toLowerCase()] ||
      "bg-white/5 text-gray-400 border-white/10"
    );
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: "bg-green-500/10 text-green-500 border-green-500/20",
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      failed: "bg-red-500/10 text-red-500 border-red-500/20",
      refunded: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    };
    return (
      colors[status?.toLowerCase()] ||
      "bg-white/5 text-gray-400 border-white/10"
    );
  };

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - (price * discount) / 100;
  };

  // Safe access to product properties
  const getProductName = (product: any) => {
    return product?.name || `Product ID: ${product?._id || "Unknown"}`;
  };

  const getProductPrice = (product: any) => {
    return product?.price || 0;
  };

  const getProductDiscount = (product: any) => {
    return product?.discountPercent || 0;
  };

  const getProductImages = (product: any) => {
    return product?.images || [];
  };

  const getProductCategory = (product: any) => {
    return product?.category?.name || null;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-white/10 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          View Details
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] lg:max-w-6xl max-h-[80vh] overflow-hidden flex flex-col p-0 bg-[#0a0a0a] border-white/10">
        <DialogHeader className="px-6 pt-5 pb-3 bg-white/5 border-b border-white/10">
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="h-5 w-5 text-gray-400" />
            Order Details
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-400">
            Complete information about order #{order?.orderNumber || orderId}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-white mb-3" />
              <p className="text-sm text-gray-400">Loading order details...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
                <p className="text-red-500 font-medium mb-2">
                  Failed to load order details
                </p>
                <p className="text-sm text-red-500/80">Please try again later</p>
              </div>
            </div>
          ) : (
            order && (
              <div className="space-y-4">
                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Left Column - Main Content */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* Order Summary Card */}
                    {/* Order Summary Card */}
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-white mb-1">
                            Order #{order.orderNumber}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400 mb-0.5">
                            Total Amount
                          </p>
                          <p className="text-xl font-bold text-white">
                            LKR {order.total?.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap mt-3">
                        {order.paymentType !== "cod" && (
                          <Badge
                            className={`${getStatusColor(
                              order.status
                            )} px-2 py-0.5 text-xs border`}
                          >
                            {order.status?.charAt(0).toUpperCase() +
                              order.status?.slice(1)}
                          </Badge>
                        )}
                        <Badge
                          variant="outline"
                          className="px-2 py-0.5 text-xs border-white/10 text-gray-300"
                        >
                          {order.paymentType?.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                      <div className="bg-white/5 px-4 py-2.5 border-b border-white/10">
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4 text-gray-400" />
                          Order Items ({order.items?.length || 0})
                        </h3>
                      </div>
                      <div className="p-4">
                        {order.items?.length > 0 ? (
                          <div className="space-y-3">
                            {order.items.map((item: any, index: number) => {
                              const product = item.productId;
                              const price = getProductPrice(product);
                              const discountPercent =
                                getProductDiscount(product);
                              const finalPrice =
                                discountPercent > 0
                                  ? calculateDiscountedPrice(
                                    price,
                                    discountPercent
                                  )
                                  : price;
                              const images = getProductImages(item.images);

                              const category = getProductCategory(product);

                              return (
                                <div
                                  key={item._id || index}
                                  className="flex gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                  {/* Product Image */}
                                  <div className="h-20 w-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                    {images?.[0]?.url ? (
                                      <img
                                        src={images[0].url}
                                        alt={
                                          images[0].alt ||
                                          getProductName(product)
                                        }
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                        <Package className="h-8 w-8 text-gray-300" />
                                      </div>
                                    )}
                                  </div>

                                  {/* Product Details */}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-white text-sm truncate mb-1">
                                      {getProductName(product)}
                                    </h4>

                                    {category && (
                                      <div className="flex items-center gap-1.5 mb-1">
                                        <Tag className="h-3 w-3 text-gray-500" />
                                        <span className="text-xs text-gray-400">
                                          {category}
                                        </span>
                                      </div>
                                    )}

                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-xs text-gray-500">
                                        Qty:{" "}
                                        <span className="font-medium text-gray-300">
                                          {item.qty}
                                        </span>
                                      </span>

                                      {price > 0 && (
                                        <>
                                          <span className="text-xs text-gray-500">
                                            •
                                          </span>
                                          <div className="flex items-center gap-1.5">
                                            {discountPercent > 0 && (
                                              <>
                                                <span className="text-xs text-gray-500 line-through">
                                                  LKR {price.toFixed(2)}
                                                </span>
                                                <Badge
                                                  variant="outline"
                                                  className="px-1.5 py-0 text-[10px] border-white/10 text-gray-400"
                                                >
                                                  <Percent className="h-2.5 w-2.5 mr-0.5" />
                                                  {discountPercent}% OFF
                                                </Badge>
                                              </>
                                            )}
                                            <span className="text-sm font-semibold text-white">
                                              LKR {finalPrice.toFixed(2)}
                                            </span>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                    {item?.variant?.variantType !==
                                      "default" && (
                                        <p className="mt-2 text-xs text-gray-500 capitalize">
                                          {item?.variant?.variantType}:
                                          <span className="font-medium text-md text-gray-300">
                                            {item?.variant?.title}
                                          </span>
                                        </p>
                                      )}
                                  </div>

                                  {/* Quantity Badge */}
                                  <div className="flex items-start">
                                    <Badge
                                      variant="outline"
                                      className="border-white/10 text-gray-400 text-xs"
                                    >
                                      x{item.qty}
                                    </Badge>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <Package className="h-10 w-10 text-gray-500 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">
                              No items found in this order
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Sidebar Info */}
                  <div className="space-y-4">
                    {/* Shipping Information */}
                    {order.shippingData && (
                      <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                        <div className="bg-white/5 px-4 py-2.5 border-b border-white/10">
                          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            Shipping Info
                          </h3>
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="flex items-start gap-2">
                            <User className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-medium text-gray-400">
                                Name
                              </p>
                              <p className="text-sm text-gray-200">
                                {order.shippingData.name}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Mail className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-medium text-gray-400">
                                Email
                              </p>
                              <p className="text-sm text-gray-200 break-all">
                                {order.shippingData.email || "No Email"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Phone className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-medium text-gray-400">
                                Phone
                              </p>
                              <p className="text-sm text-gray-200">
                                {order.shippingData.phone}
                              </p>
                            </div>
                          </div>

                          <Separator className="my-2 bg-white/10" />

                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-medium text-gray-400">
                                Address
                              </p>
                              <p className="text-sm text-gray-200 leading-relaxed">
                                {order.shippingData.address}
                                <br />
                                {order.shippingData.city},{" "}
                                {order.shippingData.zipCode}
                                <br />
                                {order.shippingData.country}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payment Information */}
                    <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                      <div className="bg-white/5 px-4 py-2.5 border-b border-white/10">
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-gray-400" />
                          Payment
                        </h3>
                      </div>
                      <div className="p-4 space-y-2.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400">Method:</span>
                          <Badge
                            variant="outline"
                            className="border-white/10 text-gray-300 text-xs"
                          >
                            {order.paymentType?.toUpperCase()}
                          </Badge>
                        </div>

                        {order.paymentType !== "cod" && (
                          <>
                            <Separator className="bg-white/10" />
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-400">
                                Status:
                              </span>
                              <Badge
                                className={`${getPaymentStatusColor(
                                  order.paymentStatus
                                )} border text-xs`}
                              >
                                {order.paymentStatus?.charAt(0).toUpperCase() +
                                  order.paymentStatus?.slice(1)}
                              </Badge>
                            </div>
                          </>
                        )}
                        <Separator className="bg-white/10" />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400">
                            Subtotal:
                          </span>
                          <span className="text-sm font-medium text-gray-200">
                            LKR {order.subtotal?.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400">
                            Shipping:
                          </span>
                          <span className="text-sm font-medium text-gray-200">
                            LKR {order.shipping?.toFixed(2)}
                          </span>
                        </div>
                        <Separator className="bg-white/10" />
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-sm font-medium text-gray-200">
                            Total:
                          </span>
                          <span className="text-lg font-bold text-white">
                            LKR {order.total?.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        <div className="px-6 py-3 bg-white/5 border-t border-white/10 flex justify-end">
          <Button
            onClick={() => setOpen(false)}
            className="bg-white text-black hover:bg-gray-200"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OrderDetailsDialog;
