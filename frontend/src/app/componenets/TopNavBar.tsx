import React from "react";
import { Facebook, Twitter, Instagram, Phone, Mail } from "lucide-react";
import { FaTiktok } from "react-icons/fa";

const TopNavBar = () => {
  return (
    <div className="bg-primary text-black text-sm px-4 sm:px-6 py-2 flex flex-row justify-between items-center gap-2 sm:gap-0">
      {/* Left Side - Contact Info */}
      <div className="flex flex-row items-center gap-2 sm:gap-6">
        <div className="hidden sm:flex items-center gap-2">
          <Mail size={16} />
          <a
            href="mailto:bosco.pk@gmail.com"
            className="text-xs sm:text-sm hover:underline"
          >
            boscoapparel@gmail.com
          </a>
        </div>

        <div className="flex items-center gap-2">
          <Phone size={16} />
          <a
            href="tel:03441262077"
            className="text-xs sm:text-sm hover:underline"
          >
            +94 72 372 5670
          </a>
        </div>
      </div>


      {/* Right Side - Social Icons */}
      <div className="flex justify-center sm:justify-end items-center gap-3">
        <a href="https://www.facebook.com//" className="hover:text-gray-500">
          <Facebook size={16} />
        </a>
        <a href="https://www.tiktok.com/@?_t=ZS-90gmlY7ZRJs&_r=1" className="hover:text-gray-500">
          <FaTiktok size={16} />
        </a>
        <a href="https://www.instagram.com/igsh=dzNpMzZzMHBraXc3" className="hover:text-gray-500">
          <Instagram size={16} />
        </a>
      </div>
    </div>
  );
};

export default TopNavBar;