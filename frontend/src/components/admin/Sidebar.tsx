"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  Settings,
  Bell,
  TrendingUp,
  BarChart3,
  LogOut,
  Menu,
  X,
  Tags,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { selectCurrentUser } from "@/app/redux/selector";
import { useSelector } from "react-redux";
import { useLogoutMutation } from "@/app/redux/features/auth/authApi";
// import { useAuth } from "@/components/auth/AuthProvider"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  // { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Categories", href: "/admin/categories", icon: Tags },
  { name: "Products", href: "/admin/products", icon: Package },
  // { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  // { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  // const { user, logout } = useAuth()
  const user = useSelector(selectCurrentUser);
  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-white">
                Admin Panel
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-white text-black shadow-md"
                      : "text-gray-400 hover:bg-white/10 hover:text-white"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Notifications */}
          {/* <div className="px-4 py-4 border-t border-gray-200">
            <Link
              href="/admin/notifications"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <Bell className="mr-3 h-5 w-5" />
              Notifications
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                3
              </span>
            </Link>
          </div> */}

          {/* User section */}
          <div className="px-4 py-4 border-t border-white/10">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-gray-400 text-sm font-medium">
                  {user?.name?.charAt(0) || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.email || "user@example.com"}
                </p>
                <p className="text-xs text-primary font-medium">
                  {user?.role?.toUpperCase() || "USER"}
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              className="w-full bg-white hover:bg-gray-200 text-black font-semibold py-6 px-6 rounded-xl shadow-lg 
  hover:shadow-xl transform transition-all duration-300 
  hover:scale-[1.02] active:scale-[0.98] 
  disabled:opacity-50 disabled:cursor-not-allowed 
  group relative overflow-hidden"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
