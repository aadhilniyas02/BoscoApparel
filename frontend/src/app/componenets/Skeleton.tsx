import { Skeleton } from "@/components/ui/skeleton"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function ProductSkeletonSlider() {
  return (
    <div className="relative">
      <Swiper
        modules={[Navigation]}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 24 },
        }}
        className="w-full"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <SwiperSlide key={index}>
            <div className="group relative bg-black/40 rounded-2xl shadow-lg overflow-hidden border border-white/10">
              {/* Product Image Skeleton */}
              <div className="relative h-64 bg-white/5">
                <Skeleton className="h-full w-full" />
              </div>

              {/* Info Skeleton */}
              <div className="p-6 space-y-3">
                <Skeleton className="h-3 w-20 rounded-full" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-16 rounded-md" />
                  <Skeleton className="h-4 w-10 rounded-md" />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Skeleton */}
      <button
        disabled
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full p-3 shadow-lg opacity-50"
      >
        <Skeleton className="w-6 h-6 rounded-full" />
      </button>
      <button
        disabled
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full p-3 shadow-lg opacity-50"
      >
        <Skeleton className="w-6 h-6 rounded-full" />
      </button>

      {/* Pagination Skeleton */}
      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={index}
            className="w-3 h-3 rounded-full bg-white/20"
          />
        ))}
      </div>
    </div>
  )
}

export default function CategorySkeletonSlider() {
  return (
    <div className="relative">
      <Swiper
        modules={[Navigation]}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 24 },
          1024: { slidesPerView: 4, spaceBetween: 24 },
        }}
        className="pb-12"
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <SwiperSlide key={index}>
            <CategoryCardSkeleton />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Left Arrow Skeleton */}
      <button
        disabled
        className="absolute top-1/2 -left-4 transform -translate-y-1/2 z-10 p-3 bg-white/90 rounded-full shadow-lg opacity-50"
      >
        <Skeleton className="w-6 h-6 rounded-full bg-gray-300" />
      </button>

      {/* Right Arrow Skeleton */}
      <button
        disabled
        className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10 p-3 bg-white/90 rounded-full shadow-lg opacity-50"
      >
        <Skeleton className="w-6 h-6 rounded-full bg-gray-300" />
      </button>

      {/* Pagination Dots Skeleton */}
      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={index}
            className="w-3 h-3 rounded-full bg-gray-300"
          />
        ))}
      </div>
    </div>
  )
}

function CategoryCardSkeleton() {
  return (
    <div className="relative bg-black/40 rounded-xl border border-white/10 overflow-hidden h-full">
      {/* Image Skeleton */}
      <div className="relative h-40 bg-white/5">
        <Skeleton className="h-full w-full" />

        {/* Featured Tag */}
        <div className="absolute top-4 left-4">
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>
      </div>

      {/* Info Skeleton */}
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>

      {/* Hover Button Skeleton */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Skeleton className="h-8 w-32 rounded-lg" />
      </div>
    </div>
  )
}


export function ProductSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card
          key={index}
          className="group hover:shadow-2xl transition-shadow duration-300 bg-gray-200/10"
        >
          <CardHeader className="p-4 pb-2">
            {/* Product Image Skeleton */}
            <div className="relative aspect-square bg-white/5 rounded-lg overflow-hidden">
              <Skeleton className="h-full w-full" />
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-2 space-y-3">
            {/* Category Badge */}
            <Skeleton className="h-4 w-20 rounded-md" />

            {/* Product Name */}
            <Skeleton className="h-5 w-40 rounded-md" />

            {/* Description */}
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />

            {/* Price + Rating */}
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-4 w-10 rounded-md" />
            </div>

            {/* Stock Info */}
            <Skeleton className="h-3 w-24 rounded-md" />
          </CardContent>

          <CardFooter className="p-4 pt-0">
            {/* Add to Cart Button */}
            <Skeleton className="h-10 w-full rounded-lg" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export function FilterSkeleton() {
  return (
    <div className="mb-8 space-y-4">
      {/* Category Badges Skeleton */}
      <div className="flex flex-wrap justify-center gap-2">
        {/* Filter icon placeholder */}
        <Skeleton className="h-5 w-5 rounded-full" />

        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-8 w-20 rounded-full bg-gray-200/10"
          />
        ))}
      </div>
    </div>
  )
}



export function ProductDetailsSkeleton() {
  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button Skeleton */}
        <div className="mb-8 flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-black/40 rounded-2xl shadow-lg overflow-hidden border border-white/10">
              <Skeleton className="aspect-square w-full bg-gray-200/10" />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-xl bg-gray-200/10" />
              ))}
            </div>
          </div>

          {/* Product Details Skeleton */}
          <div className="space-y-6">
            {/* Product Name */}
            <Skeleton className="h-8 w-2/3 rounded-md bg-gray-200/10" />

            {/* Category */}
            <Skeleton className="h-4 w-32 rounded-md bg-gray-200/10" />

            {/* Price */}
            <Skeleton className="h-6 w-24 rounded-md bg-gray-200/10" />

            {/* Stock Status */}
            <Skeleton className="h-5 w-40 rounded-full bg-gray-200/10" />

            {/* Description */}
            <Skeleton className="h-4 w-full bg-gray-200/10" />
            <Skeleton className="h-4 w-5/6 bg-gray-200/10" />
            <Skeleton className="h-4 w-2/3 bg-gray-200/10" />

            {/* Add to Cart Button */}
            <Skeleton className="h-12 w-full rounded-xl bg-gray-200/10" />

            {/* Share Button */}
            <div className="flex gap-4">
              <Skeleton className="h-12 flex-1 rounded-xl bg-gray-200/10" />
              <Skeleton className="h-12 flex-1 rounded-xl bg-gray-200/10" />
            </div>

            {/* Shipping Info */}
            <div className="border-t pt-6 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-200/10">
                  <Skeleton className="w-5 h-5 rounded-full bg-gray-200/10" />
                  <Skeleton className="h-4 w-48 rounded-md bg-gray-200/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


