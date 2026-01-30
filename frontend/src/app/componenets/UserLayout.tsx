import React from "react";
import TopNavBar from "./TopNavBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackToTop from "./BackToTopButton";

function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <TopNavBar /> */}
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
}

export default UserLayout;
