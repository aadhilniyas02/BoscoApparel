"use client";
import { useState } from "react";
import { Star, Heart, ShoppingCart, Eye, Leaf, Zap, Crown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TopRankedProducts() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const router = useRouter();

  const topProducts = [
    {
      id: 1,
      name: "Green Glow Serum",
      category: "Skincare",
      price: 42.99,
      rating: 4.9,
      reviewCount: 1284,
      image:
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=500&q=80",
      isBestSeller: true,
      isNew: false,
      discount: 0,
    },
    {
      id: 2,
      name: "Natural Finish Foundation",
      category: "Makeup",
      price: 34.99,
      rating: 4.8,
      reviewCount: 892,
      image:
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80",
      isBestSeller: true,
      isNew: true,
      discount: 15,
    },
    {
      id: 3,
      name: "Eco Lipstick - Rosewood",
      category: "Lipstick",
      price: 24.99,
      rating: 4.7,
      reviewCount: 567,
      image:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500&q=80",
      isBestSeller: false,
      isNew: true,
      discount: 10,
    },
    {
      id: 4,
      name: "Organic Mascara",
      category: "Eyes",
      price: 28.99,
      rating: 4.6,
      reviewCount: 423,
      image:
        "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=500&q=80",
      isBestSeller: true,
      isNew: false,
      discount: 0,
    },
    {
      id: 5,
      name: "Sustainable Blush Palette",
      category: "Cheeks",
      price: 38.99,
      rating: 4.9,
      reviewCount: 321,
      image:
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=500&q=80",
      isBestSeller: false,
      isNew: true,
      discount: 20,
    },
    {
      id: 6,
      name: "Bamboo Makeup Brushes",
      category: "Tools",
      price: 45.99,
      rating: 4.8,
      reviewCount: 234,
      image:
        "https://images.unsplash.com/photo-1556228577-135c319f2301?auto=format&fit=crop&w=500&q=80",
      isBestSeller: true,
      isNew: false,
      discount: 5,
    },
  ];

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  const handleAddToCart = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    // Add to cart logic here
    console.log("Added to cart:", productId);
  };

  return (
    <div id="top-rated" className="min-h-screen bg-white py-[40px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold tracking-tight text-black mb-2">
            Top Rated Products
          </h2>
          <p className="text-md text-gray-600 max-w-2xl mx-auto">
            Discover our most loved products by thousands of beauty enthusiasts
          </p>
          <div className="w-24 h-1 bg-black mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topProducts.map((product, index) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-xl border border-gray-200 hover:border-black transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => handleProductClick(product.id)}
            >
              {/* Product Image Section */}
              <div className="relative h-64 bg-gray-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Top Ribbon */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {product.isBestSeller && (
                    <span className="px-3 py-1 bg-black text-white text-xs font-medium rounded-full flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Best Seller
                    </span>
                  )}
                  {product.isNew && (
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                      New
                    </span>
                  )}
                </div>

                {/* Discount Badge */}
                {product.discount > 0 && (
                  <span className="absolute top-4 right-4 px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-full">
                    -{product.discount}%
                  </span>
                )}

                {/* Rank Badge */}
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-black/80 text-white text-sm font-medium rounded-full">
                    #{index + 1}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                    className={`p-2 rounded-full backdrop-blur-sm transition-colors duration-200 ${favorites.includes(product.id)
                        ? "bg-red-50 text-red-600"
                        : "bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-600"
                      }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${favorites.includes(product.id) ? "fill-current" : ""
                        }`}
                    />
                  </button>
                  <button className="p-2 bg-white/90 text-gray-600 rounded-full backdrop-blur-sm hover:bg-gray-100 hover:text-black transition-colors duration-200">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) => handleAddToCart(e, product.id)}
                    className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-sm text-gray-600 font-medium">
                      {product.category}
                    </span>
                    <h3 className="font-semibold text-gray-900 group-hover:text-black transition-colors duration-200">
                      {product.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    {product.discount > 0 ? (
                      <div>
                        <span className="text-lg font-bold text-black">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 line-through ml-2">
                          $
                          {(
                            product.price /
                            (1 - product.discount / 100)
                          ).toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-black">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating Section */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({product.reviewCount.toLocaleString()})
                    </span>
                  </div>

                  {/* Sustainability Badge */}
                  <div className="flex items-center gap-1 text-gray-600">
                    <Leaf className="w-4 h-4" />
                    <span className="text-xs font-medium">Eco-Friendly</span>
                  </div>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
