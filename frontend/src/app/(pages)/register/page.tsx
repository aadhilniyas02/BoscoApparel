"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSignupMutation } from "@/app/redux/features/auth/authApi";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Leaf, Sparkles, ArrowRight } from "lucide-react";
import UserLayout from "@/app/componenets/UserLayout";

const RegisterPage = () => {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const [signup, { isLoading }] = useSignupMutation();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmpassword") as string;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (confirmPassword !== password) {
      setError("Passwords do not match");
      return;
    }

    const payload = { name, email, password, role: "user" };

    try {
      const res = await signup(payload).unwrap();
      if (res.success) {
        setError("");
        router.push("/");
      } else {
        setError(res.message || "Registration failed");
      }
    } catch (err: unknown) {
      // setError(err?.data?.message || "Error, try again");
      if (err && typeof err === "object" && "data" in err) {
        const e = err as { data?: { message?: string } };
        setError(e.data?.message || "Error, try again");
      } else {
        setError("Error, try again");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">

      {/* Background animations (same as login) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-green-200 to-emerald-300 opacity-30 blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-lime-200 to-green-300 opacity-25 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-green-100 to-emerald-200 opacity-20 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>


        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 opacity-30 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 opacity-25 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 opacity-20 blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>

      </div>

      <div className="flex min-h-full flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-black">
            {/* <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r text-primary bg-clip-text "> */}
            Create Account
          </h2>

          <p className="mt-3 text-gray-600">Join us and start your journey</p>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white/90 backdrop-blur-xl px-8 py-10 shadow-2xl rounded-3xl border border-white/30 relative overflow-hidden">
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23068a48' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              ></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-green-50/10 rounded-3xl"></div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {error && (
                <div className="bg-green-50 border border-green-200 text-primary px-4 py-3 rounded-xl text-sm animate-in slide-in-from-top-2 duration-300 flex items-center">
                  <div className="w-2 h-2 rounded-full mr-3 animate-pulse"></div>
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full pl-4 pr-4 py-4 text-gray-900 bg-white/70 border border-green-200 rounded-xl placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-4 pr-4 py-4 text-gray-900 bg-white/70 border border-green-200 rounded-xl placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full pl-4 pr-12 py-4 text-gray-900 bg-white/70 border border-green-200 rounded-xl placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors duration-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmpassword"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmpassword"
                    name="confirmpassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="block w-full pl-4 pr-12 py-4 text-gray-900 bg-white/70 border border-green-200 rounded-xl placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors duration-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded border-green-300 text-green-500 focus:ring-green-500"
                />
                <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                  I accept the terms and conditions
                </label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r bg-primary text-white font-semibold py-6 px-6 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                {isLoading ? (
                  <div className="flex items-center justify-center relative z-10">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-3"></div>
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center justify-center relative z-10">
                    Create Account
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                )}
              </Button>

              {/* Switch to login */}
              <div className="text-center mt-6">
                <p className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="font-semibold text-primary hover:text-gray-500 transition-colors duration-300 cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              </div>


            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
