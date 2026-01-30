"use client";
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Minus,
  Plus,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetProductByIdQuery } from "@/app/redux/features/products/productApi";
import { useParams } from "next/navigation";
import { Product } from "@/app/redux/features/products/types";
import { useDispatch } from "react-redux";
import { addToCart } from "@/app/redux/features/cart/cartSlice";
import { ProductDetailsSkeleton } from "@/app/componenets/Skeleton";
import defaultimg from "../../../../../public/HeroImages/defaultimg.png";
import toast from "react-hot-toast";

export default function SingleProduct() {
  const params = useParams();
  const id = params?.id as string;
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetProductByIdQuery(id);

  // Extract product from response or set to null
  const product = response?.product;

  const updateQuantity = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const handleShare = async (product: Product) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: `${window.location.origin}/products/${product._id}`,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // fallback: copy link to clipboard
      const url = `${window.location.origin}/products/${product._id}`;
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const nextImage = () => {
    if (product?.images) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images) {
      setSelectedImage(
        (prev) =>
          (prev - 1 + product.images.length) % product.images.length
      );
    }
  };
  useEffect(() => {
    const handlePopState = () => {
      // If the user goes back using browser controls
      const cameFromProducts = sessionStorage.getItem("cameFromProductsPage");
      if (cameFromProducts === "true") {
        sessionStorage.setItem("returningToProductsPage", "true");
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  // Loading state
  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  // Error state
  if (isError || !product) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-400 mb-6">
            {"Sorry, we couldn't find the product you're looking for."}
          </p>
          <button
            onClick={() => router.back()}
            className="bg-primary text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const goBackToProducts = () => {
    const cameFromProductsPage = sessionStorage.getItem("cameFromProductsPage");

    if (cameFromProductsPage === "true") {
      sessionStorage.setItem("returningToProductsPage", "true");
    }
    router.back();
  };
  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={goBackToProducts}
          className="mb-8 flex items-center cursor-pointer gap-2 text-gray-400 hover:text-gray-500 transition-colors duration-300"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-black/40 rounded-2xl shadow-lg overflow-hidden border border-white/10">
              <div className="aspect-square relative">
                {product.images?.length > 0 ? (
                  <img
                    src={
                      product.images[selectedImage]?.url ||
                      "/placeholder-image.jpg"
                    }
                    alt={
                      product.images[selectedImage]?.alt || product.name
                    }
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={defaultimg.src}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Badge */}
                <div
                  className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-sm font-semibold bg-black`}
                >
                  New
                </div>

                {/* Navigation Arrows - Only show if multiple images */}
                {product.images?.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-lg"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-lg"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images?.length > 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === index
                        ? "border-white shadow-lg"
                        : "border-white/10 hover:border-white/30"
                        }`}
                    >
                      <img
                        src={image.url}
                        alt={image.alt || `${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Name */}
            <h1 className="text-3xl font-bold text-white">{product.name}</h1>

            {/* Category */}
            <div className="text-gray-400">
              Category: {product.category?.name || "Uncategorized"}
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              {(product.discountPercent ?? 0) > 0 ? (
                <>
                  <span className="text-3xl font-bold text-white">
                    LKR{" "}
                    {(
                      product.price -
                      (product.price * (product.discountPercent ?? 0)) / 100
                    ).toFixed(0)}
                  </span>
                  <span className="text-lg line-through text-gray-500">
                    LKR {product.price}
                  </span>
                  <span className="text-sm text-red-400 font-semibold">
                    {product.discountPercent}% OFF
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-white">
                  LKR {product.price}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${product.inventory?.inStock
                ? "bg-green-900/30 text-green-400 border border-green-800"
                : "bg-red-900/30 text-red-400 border border-red-800"
                }`}
            >
              {product.inventory?.inStock
                ? `In Stock (${product.inventory.quantity} available)`
                : "Out of Stock"}
            </div>

            {/* Description */}
            <p className="text-gray-400 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-300">
                Quantity:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(-1)}
                  disabled={quantity <= 1}
                  className="p-2 rounded-full border border-white/20 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium text-white">{quantity}</span>
                <button
                  onClick={() => updateQuantity(1)}
                  className="p-2 rounded-full border border-white/20 text-white hover:bg-white/10"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                disabled={!product.inventory?.inStock}
                onClick={() => {
                  dispatch(
                    addToCart({
                      product,
                      qty: quantity,
                    })
                  );
                  toast.success(`${product.name} added to cart`);
                }}
                className={`w-full cursor-pointer py-4 px-8 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-3 ${product.inventory?.inStock
                  ? "bg-white text-black hover:bg-gray-200"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed"
                  }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {product.inventory?.inStock
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>

              <div className="flex gap-4">
                <button
                  onClick={() => handleShare(product)}
                  className=" cursor-pointer flex-1 border-2 border-white/10 text-white py-3 px-6 rounded-xl font-medium hover:border-white/30 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
