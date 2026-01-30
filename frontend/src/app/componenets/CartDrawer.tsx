"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartSubtotal,
  increaseQty,
  decreaseQty,
  removeFromCart,
} from "../redux/features/cart/cartSlice";
import { ShoppingCart } from "lucide-react";
import defaultimg from "../../../public/HeroImages/defaultimg.png";

type ShoppingCartDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function ShoppingCartDrawer({
  open,
  setOpen,
}: ShoppingCartDrawerProps) {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="!w-[96%] sm:!w-[75%] md:!w-[50%] lg:!w-[35%] xl:!w-[30%] p-6 flex flex-col overflow-y-auto transition-all duration-500 ease-in-out bg-background border-l border-white/10"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-white">Shopping Cart</SheetTitle>
        </SheetHeader>

        {/* Cart Items */}
        <div className="mt-6 space-y-6 flex-1">
          {items.length > 0 ? (
            items.map((item: any) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row gap-4 border-b border-white/10 pb-4 hover:bg-white/5 rounded-lg p-2 transition-all duration-300"
              >
                {/* Product Image */}
                <div className="flex-shrink-0 mx-auto sm:mx-0">
                  <img
                    src={item.image || defaultimg.src}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col">
                  <h3 className="font-semibold text-base sm:text-lg text-white">
                    {item.name}
                  </h3>

                  <p className="font-bold mt-2 text-white text-sm sm:text-base">
                    LKR. {item.price}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 sm:gap-3 mt-auto flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        dispatch(
                          decreaseQty({
                            id: item._id,
                          })
                        )
                      }
                      className="rounded-full w-8 h-8 sm:w-9 sm:h-9 border-white/20 text-white hover:bg-white/10"
                    >
                      -
                    </Button>

                    <span className="font-medium text-sm sm:text-base text-white">
                      {item.qty}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        dispatch(
                          increaseQty({
                            id: item._id,
                          })
                        )
                      }
                      className="rounded-full w-8 h-8 sm:w-9 sm:h-9 border-white/20 text-white hover:bg-white/10"
                    >
                      +
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary ml-auto hover:bg-red-50"
                      onClick={() =>
                        dispatch(
                          removeFromCart({
                            id: item._id,
                          })
                        )
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Empty Cart Message
            <div className="flex flex-col items-center justify-center py-16 px-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="p-6 bg-white/10 rounded-full">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-white">
                Your cart is empty
              </h2>
              <p className="mt-2 text-gray-400 text-center max-w-sm">
                Looks like you haven’t added anything yet. Browse our products
                and add items to your cart.
              </p>
              <Link href="/products" className="mt-6">
                <Button className="px-6 py-3 text-md cursor-pointer rounded-xl shadow-md hover:shadow-lg transition-all bg-white text-black hover:bg-gray-200">
                  Start Shopping
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="mt-6 border-t border-white/10 pt-4 space-y-4 bg-white/5 rounded-xl p-4">
            <div className="flex justify-between text-base sm:text-lg font-semibold text-white">
              <span>Subtotal:</span>
              <span>LKR.{subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400">
              Shipping and taxes are calculated at checkout.
            </p>
            <Link href="/checkout">
              <Button className="w-full h-11 sm:h-12 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:scale-[1.02] transition-transform text-black bg-white hover:bg-gray-200">
                Checkout
              </Button>
            </Link>
            <p className="text-center text-sm mt-2">
              OR{" "}
              <span
                className="text-primary font-medium cursor-pointer hover:underline"
                onClick={() => setOpen(false)}
              >
                Continue Shopping
              </span>
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
