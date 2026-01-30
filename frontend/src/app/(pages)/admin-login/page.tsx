"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Leaf } from "lucide-react";
import { useLoginMutation } from "@/app/redux/features/auth/authApi";

const LoginPage = () => {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      const result = await login({ email, password }).unwrap();
      if (result.success) {
        setError("");
        const role = result.data.user.role;
        if (role === "admin") router.push("/admin");
        else router.push("/");
      } else setError(result.message || "Invalid credentials");
    } catch (err: any) {
      setError(err?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Elements */}


      <div className="flex min-h-full flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Welcome Back
          </h2>
          <p className="mt-3 text-gray-400">
            Sign in to your account and continue your journey
          </p>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-black/40 backdrop-blur-xl px-8 py-10 shadow-2xl rounded-3xl border border-white/10 relative overflow-hidden">
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              ></div>
            </div>

            {/* Glass effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>

            <div className="space-y-6 relative z-10">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-in slide-in-from-top-2 duration-300 flex items-center">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-3 animate-pulse"></div>
                  {error}
                </div>
              )}



              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-white mb-2"
                  >
                    Email address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-white transition-colors duration-300" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 text-white bg-white/5 border border-white/10 rounded-xl placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-300 hover:bg-white/10 focus:bg-white/5"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-white mb-2"
                  >
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-white transition-colors duration-300" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-12 pr-12 py-4 text-white bg-white/5 border border-white/10 rounded-xl placeholder:text-gray-500 focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-300 hover:bg-white/10 focus:bg-white/5"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black accent-white"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm text-gray-300"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-white transition-colors duration-300"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-white text-black font-semibold py-6 px-6 rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-200 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                  {isLoading ? (
                    <div className="flex items-center justify-center relative z-10">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-3"></div>
                      Signing you in...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center relative z-10">
                      Sign in
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  )}
                </Button>
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
