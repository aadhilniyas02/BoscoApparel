"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  Truck,
  ShieldCheck,
  MapPin,
  User,
  Phone,
  Mail,
} from "lucide-react";
import UserLayout from "@/app/componenets/UserLayout";
import defaultimg from "../../../../public/HeroImages/defaultimg.png";
import {
  selectCartItems,
  clearCart,
} from "@/app/redux/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCreateOrderMutation } from "@/app/redux/features/order/orderApi";

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

interface CartItem {
  _id: string;
  id?: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  inventory?: { quantity: number; inStock: boolean };
}

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const items = useSelector(selectCartItems) as CartItem[];

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const [paymentType, setPaymentType] = useState<"bank" | "cod">("bank");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "Sri Lanka",
  });

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = subtotal > 1500 ? 0 : 200;
  const total = subtotal + shipping;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const validateForm = (): boolean => {
    const { name, email, phone, address, city, zipCode, country } = formData;

    if (!name || !phone || !address || !city || !country) {
      toast.error("Please fill in all required fields");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return false;
    }

    return true;
  };
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    try {
      // Prepare order data
      const orderData = {
        items: items.map((item) => ({
          productId: item._id || item.id,
          qty: item.qty,
          price: item.price,
        })),
        shippingData: formData,
        paymentType,
        subtotal,
        shipping,
        total,
      };

      // Create order
      const response = await createOrder(orderData).unwrap();

      // Save shipping data ID to localStorage for future use
      if (response.data.shippingDataId) {
        localStorage.setItem(
          "lastShippingDataId",
          response.data.shippingDataId
        );
      }

      // Clear cart
      dispatch(clearCart());

      // Show success message
      toast.success("Order placed successfully!");

      if (response.data.order.orderNumber) {
        router.push(`/orderconfirmed/${response.data.order.orderNumber}`);
      }
      // Redirect to order confirmation page
    } catch (error: any) {
      console.error("Order placement error:", error);
      toast.error(
        error?.data?.message || "Failed to place order. Please try again."
      );
    }
  };

  return (
    <UserLayout>
      <div className="min-h-screen bg-background md:p-8">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Billing Information */}
              <div className="bg-black/40 backdrop-blur-sm shadow-xl rounded-2xl p-5 border border-white/10 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    Billing Information
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-300 flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-white focus:ring-2 focus:ring-white/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-300 flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="johndoe@email.com"
                      className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-white focus:ring-2 focus:ring-white/20 transition-all"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-gray-300 flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+92 9876543210"
                      className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-white focus:ring-2 focus:ring-white/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-black/40 backdrop-blur-sm shadow-xl rounded-2xl p-5 border border-white/10 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    Shipping Address
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <Label
                      htmlFor="address"
                      className="text-sm font-medium text-gray-300"
                    >
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main St"
                      className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-white focus:ring-2 focus:ring-white/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="city"
                      className="text-sm font-medium text-gray-300"
                    >
                      City
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Karachi"
                      className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-white focus:ring-2 focus:ring-white/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="zipCode"
                      className="text-sm font-medium text-gray-300"
                    >
                      Zip Code
                    </Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="400001"
                      className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-white focus:ring-2 focus:ring-white/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="country"
                      className="text-sm font-medium text-gray-300"
                    >
                      Country
                    </Label>
                    <Input
                      readOnly
                      id="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Sri Lanka"
                      className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-white focus:ring-2 focus:ring-white/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="bg-black/40 backdrop-blur-sm shadow-xl rounded-2xl p-5 border border-white/10 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    Payment
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* COD Option */}
                  <label className="flex items-center gap-3 border border-white/10 rounded-xl p-4 cursor-pointer hover:border-white/30 transition-all">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentType === "cod"}
                      onChange={(e) =>
                        setPaymentType(e.target.value as "cod" | "bank")
                      }
                      className="accent-white"
                    />
                    <span className="font-medium text-gray-300">
                      Cash on Delivery (COD)
                    </span>
                  </label>

                  {/* Bank Deposit Option */}
                  <div className="border border-white/10 rounded-xl p-4 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="bank"
                        checked={paymentType === "bank"}
                        onChange={(e) =>
                          setPaymentType(e.target.value as "cod" | "bank")
                        }
                        className="accent-white"
                      />
                      <span className="font-medium text-gray-300">
                        Bank Deposit
                      </span>
                    </label>

                    {paymentType === "bank" && (
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-sm text-gray-300 break-words w-full max-w-full overflow-hidden">
                        <p className="text-base font-semibold text-white">
                          BOC Bank
                        </p>
                        <p>
                          Account Title: <strong>Bosco Apparel</strong>
                        </p>
                        <p className="break-all">
                          Account Number: <strong>90248832</strong>
                        </p>
                        <p className="break-all">
                          Branch: <strong>Ukuwela</strong>
                        </p>

                        <hr className="my-3 border-white/10" />

                        <p className="leading-relaxed">
                          Please send a screenshot of the payment details with
                          your order number to{" "}
                          <a
                            href="https://wa.me/94723725670"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white font-medium underline hover:text-gray-300 break-all"
                          >
                            WhatsApp: +94 72 372 5670
                          </a>
                          .
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Order Summary */}
            <div className="bg-black/40 backdrop-blur-sm shadow-xl rounded-2xl p-5 border border-white/10 h-fit sticky top-24">
              <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
                <div className="p-1 bg-white/10 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                Order Summary
              </h2>

              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {items.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/10"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.image || defaultimg.src}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover shadow-md"
                      />
                      <div className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                        {item.qty}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">
                        {item.name}
                      </h3>

                      <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-bold text-white">
                        LKR. {(item.price * item.qty).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 mt-6 pt-6 space-y-3">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({items.length} items)</span>
                  <span>LKR. {subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    Shipping
                  </span>
                  {shipping > 0 ? (
                    <span>LKR. {shipping.toLocaleString()}</span>
                  ) : (
                    <span className="text-green-400 font-medium">Free</span>
                  )}
                </div>

                {subtotal < 1500 && (
                  <p className="text-sm text-gray-400 text-center bg-white/5 py-1 rounded-lg">
                    Add LKR. {(1500 - subtotal).toLocaleString()} more for free
                    shipping
                  </p>
                )}

                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between text-xl font-bold text-white">
                    <span>Total</span>
                    <span>LKR. {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={isLoading || items.length === 0}
                className="w-full mt-6 bg-white text-black hover:bg-gray-200 font-semibold h-14 text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  `Place Order - LKR. ${total.toLocaleString()}`
                )}
              </Button>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div >
          </div >
        </div >
      </div >
    </UserLayout >
  );
}
