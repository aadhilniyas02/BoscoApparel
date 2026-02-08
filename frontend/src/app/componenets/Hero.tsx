
import Image from "next/image";
import Link from "next/link";
import img1 from "../../../public/HeroImages/pic1.jpg";
import img2 from "../../../public/HeroImages/pic2.jpg";

export default function Hero() {
  const primary = "#f2bcb5"; // New blush pink tone
  const categories = [
    "Skincare",
    "Makeup",
    "Fragrance",
    "Haircare",
    "Bath & Body",
  ];

  return (
    <section
      id="top"
      className="relative min-h-screen overflow-hidden px-4 sm:px-0 mx-auto pb-[50px] sm:py-0"
    >
      {/* Background Gradient - Blush Pink Theme */}
      <div className="absolute inset-0 bg-background"></div>

      {/* Floating Ornaments - Pink */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full opacity-40 blur-xl"></div>
      <div className="absolute bottom-40 right-20 w-32 h-32 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full opacity-30 blur-xl"></div>

      <div className="relative mx-auto max-w-7xl py-6 md:py-10 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Text Content */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-4">
                <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                <span className="text-white font-medium text-sm">
                  Apparel Collection
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Your B2B
                <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent block">
                  Apparel Partner
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-lg">
                From design to delivery, Your One Stop Garment Partner - Crafting With Care
                Contact to start your own clothing line
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="group relative overflow-hidden bg-white text-black px-8 py-4 rounded-xl font-semibold text-center transition-all duration-300 hover:shadow-2xl hover:scale-105"
              >
                <span className="relative z-10">Explore Clothing</span>
                <div className="absolute inset-0 bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10+</div>
                <div className="text-sm text-gray-400">Years Experienced</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">95%</div>
                <div className="text-sm text-gray-400">
                  Customer Satisfaction
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-sm text-gray-400">Trusted Service</div>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <Image
                src={img1}
                alt="Natural Cosmetic Products"
                className="w-full h-[450px] sm:h-[500px] object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

              {/* Floating Badge */}
              {/* <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg">
                <div className="text-sm font-semibold text-gray-900">
                  Organic Choice
                </div>
                <div className="text-xs text-black">Spring Collection</div>
              </div> */}
            </div>

            {/* Secondary Image */}
            <div className="absolute -bottom-[40px] sm:-bottom-8 translate-x-[-50%] sm:translate-x-0 left-[50%] sm:-left-8 w-52 h-52 sm:w-64 sm:h-64 rounded-2xl overflow-hidden shadow-2xl transform -rotate-[20deg] border-4 border-white">
              <Image
                src={img2}
                alt="Natural Makeup Application"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating Elements */}
            {/* <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 bg-white rounded-2xl p-6 shadow-2xl hidden sm:block">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🌸</span>
                </div>
                <div className="font-bold text-gray-900">Rose Extract</div>
                <div className="text-sm text-gray-600">Infusion</div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
