"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, User, LogOut, LayoutDashboard, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import ShoppingCartDrawer from "./CartDrawer";
import SearchBar from "./SearchBar";
import { RootState } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser } from "../redux/selector";
import { useLogoutMutation } from "../redux/features/auth/authApi";
import Image from "next/image";
import { useGetProductsQuery } from "../redux/features/products/productApi";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { selectCartCount } from "../redux/features/cart/cartSlice";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [categoryFilter, setCategoryFilter] = useState("all");

  // const { data, isLoading, error } = useGetProductsQuery({
  //   category: categoryFilter !== "all" ? categoryFilter : undefined,
  //   page: 1,
  //   limit: 10,
  // });
  // const products = data?.products ?? [];

  // const cartItems=JSON.parse(localStorage.getItem("cartItems")!).length
  const cartCount = useSelector(selectCartCount)


  const user = useSelector(selectCurrentUser);

  const [isScrolled, setIsScrolled] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // const [filteredProducts, setFilteredProducts] = useState(products);

  // const cartCount = 3;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCartClick = () => {
    setShowCart(true);
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out border-b ${isScrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm"
          : "bg-background"
          } border-border/40`}
      >
        <div className="container flex items-center justify-between px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Mobile Menu */}
          <div className="flex items-center sm:hidden">

          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/logo/logonew.png"
              alt="ElixerBeauty Logo"
              width={110}
              height={50}
              className="object-contain hidden sm:block"
            />

            {/* Mobile Logo */}
            <Image
              src="/logo/logonew.png"
              alt="ElixerBeauty Logo"
              width={120}
              height={40}
              className="object-contain sm:hidden"
            />
          </Link>

          {/* Search Bar (desktop) */}
          <div className="hidden sm:flex flex-1 max-w-2xl mx-8">
            <SearchBar />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
            {/* Cart */}
            <Button
              variant="outline"
              onClick={handleCartClick}
              aria-label={`Shopping Cart with ${cartCount} items`}
              className="relative text-base py-2 px-4 text-muted-foreground hover:text-primary hover:bg-accent"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-[11px] font-bold leading-none text-primary-foreground bg-primary rounded-full">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* Desktop Auth */}
            {/* <div className="hidden sm:flex items-center gap-2">
              {!user ? (
                <>
                  <Button
                    onClick={() => router.push("/login")}
                    variant="ghost"
                    className="text-base py-2 px-4 cursor-pointer"
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="default"
                    className="bg-primary cursor-pointer text-white text-base py-2 px-4"
                    onClick={() => router.push("/register")}
                  >
                    Register
                  </Button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 text-base py-2 px-4"
                    >
                      <User className="w-5 h-5" />
                      <span>{user?.name || "User"}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user.role === "admin" ? (
                      <DropdownMenuItem onClick={() => router.push("/admin")}>
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => router.push("/orders")}>
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Orders
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div> */}


          </div>
        </div>

        {/* Search Bar (mobile) */}
        <div className="sm:hidden px-4 pb-4 w-full">
          <SearchBar />
        </div>
      </header>

      {/* Cart Drawer */}
      <ShoppingCartDrawer open={showCart} setOpen={setShowCart} />


    </>
  );
};

export default Navbar;