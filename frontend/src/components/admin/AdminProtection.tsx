"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/app/redux/selector";
import { RootState } from "@/app/redux/store";

interface AdminProtectionProps {
  children: React.ReactNode;
}

export function AdminProtection({ children }: AdminProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const user = useSelector(selectCurrentUser);

  // const loading = useSelector((state: RootState) => state.auth.loading);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      // const userAuth = localStorage.getItem("userAuth")
      // const userRole = localStorage.getItem("userRole")
      // const userEmail = localStorage.getItem("userEmail")

      // Check if user is authenticated and has admin/manager role
      if (!user) {
        return (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        );
      } else {
        if (user?.role === "admin") {
          setIsAuthenticated(true);
        }

        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Verifying access...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
