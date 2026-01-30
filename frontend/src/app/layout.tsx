"use client";

import Navbar from "./componenets/Navbar";
import Footer from "./componenets/Footer";
import { type Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

import { Inter, Roboto_Mono } from "next/font/google";
import BackToTop from "./componenets/BackToTopButton";
import TopNavBar from "./componenets/TopNavBar";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import RefreshHandler from "./componenets/RefreshHandler";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //  const [refresh] = useRefreshMutation();

  //   useEffect(() => {
  //   refresh();
  // }, [refresh]);
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="h-full">
        <Provider store={store}>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
            }}
          />
          <RefreshHandler />
          {children}
        </Provider>
      </body>
    </html>
  );
}
