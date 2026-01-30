"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import { useGetCategoriesQuery } from "../redux/features/category/categoryApi";
import CategorySkeletonSlider from "./Skeleton";

export default function CosmeticCategories() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const { data, isLoading } = useGetCategoriesQuery();
  const categories = data?.categories ?? [];

  // const primary = "#f2bcb5"; // blush pink

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    router.push(`/products`);
  };

  const nextSlide = () => swiperInstance?.slideNext();
  const prevSlide = () => swiperInstance?.slidePrev();
  const goToSlide = (index: number) => swiperInstance?.slideToLoop(index);

  const CategoryCard = ({ category }: { category: (typeof categories)[0] }) => {
    return (
      <div
        className="group relative bg-black/40 rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer overflow-hidden h-full min-h-[270px]"
        onMouseEnter={() => setHoveredCategory(category._id)}
        onMouseLeave={() => setHoveredCategory(null)}
        onClick={() => handleCategoryClick(category._id, category.name)}
      >
        {/* Category Image */}
        <div className="relative h-40 bg-gray-100 overflow-hidden">
          <img
            src={category?.image?.url}
            alt={category?.image?.alt || category.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Overlay */}
          <div
            className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${hoveredCategory === category._id ? "opacity-100" : "opacity-0"
              }`}
          />

          {/* Badge */}
          {/* <div className="absolute top-4 left-4">
            <span className="inline-block px-2 py-1 bg-white/95 text-gray-700 text-xs font-medium rounded-md">
              Featured: {category.featured ? "Yes" : "No"}
            </span>
          </div> */}
        </div>

        {/* Category Info */}
        <div className="p-4">
          <h3
            className={`font-semibold text-white mb-1 transition-colors duration-300 ${hoveredCategory === category._id ? "text-gray-300" : ""
              }`}
          >
            {category.name}
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            {category.description.length > 40
              ? `${category.description.substring(0, 40)}...`
              : category.description}
          </p>
        </div>

        {/* Hover Action */}
        <div
          className={`absolute inset-0 bg-black/10 flex items-center justify-center transition-opacity duration-300 ${hoveredCategory === category._id ? "opacity-100" : "opacity-0"
            }`}
        >
          <button className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg shadow-sm hover:bg-gray-200 transition-colors duration-200">
            Explore Collection
          </button>
        </div>
      </div>
    );
  };

  return (
    <div id="categories" className="bg-background py-[40px] mb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            Clothing Categories
          </h2>
          <p className="text-md text-gray-400 max-w-2xl mx-auto">
            Discover our clothing collections
          </p>
          <div className="w-24 h-1 bg-white mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Slider */}
        <div>
          {isLoading ? (
            <CategorySkeletonSlider />
          ) : (
            <div className="relative">
              <Swiper
                onSwiper={setSwiperInstance}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                modules={[Navigation, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 20 },
                  768: { slidesPerView: 3, spaceBetween: 24 },
                  1024: { slidesPerView: 4, spaceBetween: 24 },
                }}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                loop={true}
                speed={600}
                grabCursor={true}
                className="pb-12"
              >
                {categories.map((category) => (
                  <SwiperSlide key={category._id}>
                    <CategoryCard category={category} />
                  </SwiperSlide>
                ))}
                {categories.length === 0 && !isLoading && (
                  <div className="text-center text-gray-400 py-20">
                    No categories found.
                  </div>
                )}
              </Swiper>

              {/* Left Arrow */}
              <button
                onClick={prevSlide}
                className="absolute top-1/2 -left-4 transform -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300 hover:scale-110 border border-gray-200"
              >
                <ChevronLeft className="w-6 h-6 text-black" />
              </button>

              {/* Right Arrow */}
              <button
                onClick={nextSlide}
                className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300 hover:scale-110 border border-gray-200"
              >
                <ChevronRight className="w-6 h-6 text-black" />
              </button>

              {/* Pagination Dots */}
              <div className="flex justify-center mt-8 space-x-2">
                {categories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${activeIndex === index
                      ? "bg-white w-8"
                      : "bg-gray-600 hover:bg-gray-500"
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
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
