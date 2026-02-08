"use client";
import React from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPinterest,
  FaTiktok,
  FaYoutube,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcAmex,
  FaApplePay,
  FaGooglePay,
  FaShieldAlt,
  FaTruck,
  FaHeadset,
  FaRecycle,
  FaAward,
} from "react-icons/fa";
import Image from "next/image";

import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  const links = [
    {
      icon: FaInstagram,
      url: "https://www.instagram.com/boscoapparel_?igsh=MXR2dzJzNGt3ZHF3Nw==",
    },
    {
      icon: FaFacebookF,
      url: "https://www.facebook.com/share/18iszmUq4t/?mibextid=wwXIfr",
    },
    {
      icon: FaTiktok,
      url: "https://www.tiktok.com/@boscoapparel?_t=ZS-8yLvgXJTi53&_r=1",
    },
  ]
  return (
    <footer className="w-full bg-background border-t border-white/10">
      {/* Trust Badges Section */}
      <div className="bg-white/5 py-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <FaTruck className="text-2xl text-white" />
              <div className="text-left">
                <p className="font-semibold text-sm text-gray-200"> Islandwide Delivery </p>
                <p className="text-xs text-gray-400"> Courier / Transport available </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <FaShieldAlt className="text-2xl text-white" />
              <div className="text-left">
                <p className="font-semibold text-sm text-gray-200">Secure Payment</p>
                <p className="text-xs text-gray-400">100% Protected</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <FaHeadset className="text-2xl text-white" />
              <div className="text-left">
                <p className="font-semibold text-sm text-gray-200">Production Support </p>
                <p className="text-xs text-gray-400">•Printing • Embroidery • Labeling</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <FaRecycle className="text-2xl text-white" />
              <div className="text-left">
                <p className="font-semibold text-sm text-gray-200"> Bulk Orders</p>
                <p className="text-xs text-gray-400"> Wholesale Deal Only</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-11 gap-8 lg:gap-12">
          <div className="col-span-3">
            <div className="flex items-start gap-4 mb-4">
              <div className="shrink-0">
                <Image
                  src="/logo/logonew.png"
                  alt="Bosco Apparel Logo"
                  width={110}
                  height={40}
                  className="object-contain"
                />
              </div>
              <p className="text-gray-400 leading-relaxed text-sm pt-1">
                Bosco Apparel is your destination for premium, sustainable
                clothing that enhances your personal style.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                <FaAward className="text-white shrink-0" /> 
                <span className="text-sm text-gray-300">
                  Premium Quality Materials
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                <FaRecycle className="text-white shrink-0" />
                <span className="text-sm text-gray-300">
                  Sustainable Fashion
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-span-3">
            <h3 className="font-semibold text-white mb-6">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                {[
                  { id: "top", label: "Home" },
                  { id: "categories", label: "Categories" },
                  { id: "newest", label: "Newest Arrival" },
                ].map((link) => (
                  <a
                    key={link.id}
                    href={`/#${link.id}`}
                    className="block text-gray-400 hover:text-white transition-colors cursor-pointer"
                    onClick={(e) => {
                      if (pathname === "/") {
                        e.preventDefault();
                        document
                          .getElementById(link.id)
                          ?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Shop Categories */}
          <div className="col-span-3">
            <h3 className="font-semibold text-white mb-6">
              Shop Categories
            </h3>
            <div className="space-y-3">
              {[
                "Men",
         
                "Kids",
     
                "New Arrivals",
              ].map((cat) => (
                <Link
                  key={cat}
                  href={`/products`}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Follow Us */}
          <div className="col-span-2">
            <h3 className="font-semibold text-white mb-6">Follow Us</h3>
            <div className="flex gap-6 flex-wrap">
              {links.map(
                (link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    className="p-3 bg-white/10 rounded-lg hover:bg-white hover:text-black text-gray-300 transition-colors"
                  >
                    <link.icon className="text-lg" />
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods & Bottom Bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="text-center lg:text-left">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} Bosco Apparel. All rights reserved.
              </p>
            </div>



            <div className="flex gap-4 text-sm">
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-500 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-gray-500 hover:text-white transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
