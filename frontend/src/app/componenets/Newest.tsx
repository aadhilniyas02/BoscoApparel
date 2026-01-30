"use client";
import { useState } from "react";
import {
  ShoppingCart,
  Star,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { addToCart } from "../redux/features/cart/cartSlice";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  useGetNewArrivalsQuery,
  useGetProductsQuery,
} from "@/app/redux/features/products/productApi";
import { useDispatch } from "react-redux";
import { ProductSkeletonSlider } from "./Skeleton";
import toast from "react-hot-toast";

export default function Newest() {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const dispatch = useDispatch();
  // const categories = ["All", "Skincare", "Makeup", "Fragrance", "Haircare", "Bath & Body"];

  const { data, isLoading, isError } = useGetNewArrivalsQuery({ limit: 6 });

  const products = data?.products || [];

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category?.name === activeCategory);

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Best Seller":
        return "bg-gradient-to-r from-yellow-600 to-orange-700 text-white";
      case "New":
        return "bg-black border border-white/20 text-white";
      case "Sale":
        return "bg-gradient-to-r from-gray-700 to-gray-800 text-white";
      case "Limited":
        return "bg-gradient-to-r from-purple-900 to-indigo-900 text-white";
      default:
        return "bg-gray-800 text-white";
    }
  };

  const nextSlide = () => swiperInstance?.slideNext();
  const prevSlide = () => swiperInstance?.slidePrev();
  const goToSlide = (index: number) => swiperInstance?.slideTo(index);

  const getTotalSlides = () => {
    if (!swiperInstance) return 0;
    const slidesPerView = swiperInstance.params.slidesPerView;
    if (typeof slidesPerView === "number") {
      return Math.ceil(filteredProducts.length / slidesPerView);
    }
    return Math.ceil(filteredProducts.length / 1);
  };


  return (
    <div id="newest" className="min-h-screen pt-[80px] pb-[40px] bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            Newest Arrivals
          </h2>
          <p className="text-md text-gray-400 max-w-2xl mx-auto">
            Discover our latest collection of clothing
          </p>
          <div className="w-24 h-1 bg-white mx-auto mt-3 rounded-full"></div>
        </div>

        <div>
          {isLoading ? (
            <ProductSkeletonSlider />
          ) : (
            <div className="relative">
              <Swiper
                onSwiper={setSwiperInstance}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                modules={[Navigation, Pagination]}
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 20 },
                  1024: { slidesPerView: 4, spaceBetween: 24 },
                }}
                className="w-full"
              >
                {filteredProducts.map((product) => (
                  <SwiperSlide key={product._id}>
                    <div
                      className="group relative bg-black/40 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-white/10 flex flex-col h-full min-h-[450px]"
                      onMouseEnter={() => setHoveredProduct(product._id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                    >
                      <div className="absolute top-2 z-50 right-2 transform  flex gap-2">
                        <button
                          className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() =>
                            router.push(`/products/${product._id}`)
                          }
                        >
                          <Eye className="w-5 h-5 text-gray-700" />
                        </button>

                      </div>
                      {/* Product Image */}
                      <div
                        onClick={() => router.push(`/products/${product._id}`)}
                      >
                        <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-64">
                          <img
                            src={product.images[0]?.url}
                            alt={product.images[0]?.alt || product.name}
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />

                          {/* Hover Overlay */}
                          <div
                            className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${hoveredProduct === product._id
                              ? "opacity-100"
                              : "opacity-0"
                              }`}
                          ></div>
                        </div>

                        {/* Info */}
                        <div className="p-6 flex flex-col flex-grow justify-between">
                          <div>
                            <span className="text-xs font-semibold text-gray-400 uppercase block mb-2">
                              {product.category?.name}
                            </span>
                            <h3 className="text-lg font-bold text-white mb-3">
                              {product.name}
                            </h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-3 min-h-[48px]">
                              {product.description
                                ? product.description.length > 60
                                  ? `${product.description.substring(0, 60)}...`
                                  : product.description
                                : "Discover our premium beauty product."}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 mt-auto">
                            {(product.discountPercent ?? 0) > 0 ? (
                              <>
                                <span className="text-2xl font-bold text-white">
                                  LKR{" "}
                                  {(
                                    product.price -
                                    (product.price * (product.discountPercent ?? 0)) / 100
                                  ).toFixed(0)}
                                </span>
                                <span className="text-sm line-through text-gray-500">
                                  LKR {product.price}
                                </span>
                                <span className="text-sm text-red-400 font-medium">
                                  ({product.discountPercent}% OFF)
                                </span>
                              </>
                            ) : (
                              <span className="text-2xl font-bold text-white">
                                LKR {product.price}
                              </span>
                            )}
                          </div>
                        </div>


                      </div>
                    </div>
                  </SwiperSlide>
                ))}
                {filteredProducts.length === 0 && !isLoading && (
                  <div className="text-center text-gray-400 py-20">
                    No products found.
                  </div>
                )}
              </Swiper>

              {/* Navigation */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full p-3 shadow-lg hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6 text-black" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full p-3 shadow-lg hover:scale-110"
              >
                <ChevronRight className="w-6 h-6 text-black" />
              </button>

              {/* Pagination */}
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: getTotalSlides() }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full ${activeIndex === index ? "bg-white w-8" : "bg-gray-600"
                      }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
