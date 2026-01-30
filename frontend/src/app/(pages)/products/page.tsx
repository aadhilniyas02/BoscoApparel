"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Star, Filter, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetCategoriesQuery } from "@/app/redux/features/category/categoryApi";
import { Product, ProductsResponse } from "@/app/redux/features/products/types";
import defaultimg from "../../../../public/HeroImages/defaultimg.png";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "@/app/redux/features/products/productApi";
import { useDispatch } from "react-redux";
import { addToCart } from "@/app/redux/features/cart/cartSlice";
import {
  FilterSkeleton,
  ProductSkeletonGrid,
} from "@/app/componenets/Skeleton";
import toast from "react-hot-toast";

// Custom hook for debounced search
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Prepare query parameters
  const queryParams = useMemo(
    () => ({
      category: selectedCategory !== "All" ? selectedCategory : undefined,
      search: debouncedSearchTerm || undefined,
      page: currentPage,
      limit: 12, // Adjust as needed
    }),
    [selectedCategory, debouncedSearchTerm, currentPage]
  );

  // Fetch products with query parameters
  const {
    data: productsData,
    isLoading,
    error,
  } = useGetProductsQuery(queryParams);

  // Fetch categories
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch,
  } = useGetCategoriesQuery();

  const categories = categoriesData?.categories || [];
  const products = productsData?.products || [];
  const totalPages = productsData?.pages || 1;

  const dispatch = useDispatch();

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      return;
    }
    setCurrentPage(1);
  }, [selectedCategory, debouncedSearchTerm]);

  const handleaddToCart = (product: Product) => {
    if (!product.inventory?.inStock) {
      toast.error(`${product.name} is out of stock.`);
      return;
    }
    dispatch(
      addToCart({
        product,
        // variant: product.variants[0],
        qty: 1,
      })
    );
    toast.success(`${product.name} added to cart`);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage(page);
  };

  useEffect(() => {
    const cameFromProducts = sessionStorage.getItem("cameFromProductsPage");
    const returningToProducts = sessionStorage.getItem(
      "returningToProductsPage"
    );

    if (cameFromProducts && returningToProducts) {
      const savedPage = localStorage.getItem("productsCurrentPage");
      if (savedPage) {
        const newPage = Number(savedPage);
        // console.log("🔁 Restoring saved page:", newPage);
        setCurrentPage(newPage);

        localStorage.removeItem("productsCurrentPage");
      }

      // Clean up session flags
      sessionStorage.removeItem("cameFromProductsPage");
      sessionStorage.removeItem("returningToProductsPage");
    }
  }, []);
  const goToProduct = (product: Product) => {
    localStorage.setItem("productsCurrentPage", currentPage.toString());

    sessionStorage.setItem("cameFromProductsPage", "true");

    router.push(`/products/${product._id}`);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Bosco Apparel Products
          </h1>
          <p className="text-gray-400">
            Discover our premium collection of apparel products
          </p>
        </div>
        <div>
          {/* Search and Filter Section */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>

            {/* Category Filter */}
            {isLoading ? (
              <FilterSkeleton />
            ) : (
              <div className="flex flex-wrap justify-center gap-2">
                <Filter className="h-5 w-5 text-gray-300 mt-1" />
                <Badge
                  variant={selectedCategory === "All" ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1"
                  onClick={() => setSelectedCategory("All")}
                >
                  All
                </Badge>
                {categories.map((category) => (
                  <Badge
                    key={category._id}
                    variant={
                      selectedCategory === category.name ? "default" : "outline"
                    }
                    className="cursor-pointer px-3 py-1"
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {isLoading ? (
            <ProductSkeletonGrid />
          ) : (
            <div>
              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <Card
                    key={index}
                    className="group hover:shadow-2xl transition-shadow duration-300 cursor-pointer bg-black/40 border border-white/10"
                  >
                    <CardHeader
                      className="p-4 pb-2"
                      onClick={() => goToProduct(product)}
                    >
                      {/* Product Image */}
                      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0].url}
                            alt={product.images[0].alt || product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <img
                            src={defaultimg.src}
                            alt="Default Image"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        {!product.inventory?.inStock && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <Badge
                              variant="secondary"
                              className="text-white bg-black"
                            >
                              Out of Stock
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 pt-2">
                      {/* Category Badge */}
                      <Badge variant="outline" className="mb-2 text-xs">
                        {product.category.name}
                      </Badge>

                      {/* Product Name */}
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1 text-white">
                        {product.name}
                      </h3>

                      {/* Product Description */}
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Price and Rating */}
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-2xl font-bold text-white">
                          LKR. {product.price}
                        </span>
                        {/* <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600">4.8</span>
                        </div> */}
                      </div>

                      {/* Stock Status */}
                      <div className="text-xs text-gray-400 mb-2">
                        {product.inventory?.inStock
                          ? `${product.inventory.quantity} in stock`
                          : "Out of stock"}
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                      <Button
                        className="w-full text-black cursor-pointer hover:bg-gray-200"
                        onClick={() => handleaddToCart(product)}
                        disabled={!product.inventory?.inStock}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {product.inventory?.inStock
                          ? "Add to Cart"
                          : "Out of Stock"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page =
                        currentPage <= 3
                          ? i + 1
                          : currentPage >= totalPages - 2
                            ? totalPages - 4 + i
                            : currentPage - 2 + i;

                      if (page > 0 && page <= totalPages) {
                        return (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            onClick={() => handlePageChange(page)}
                            className="min-w-[40px]"
                          >
                            {page}
                          </Button>
                        );
                      }
                      return null;
                    })}

                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {/* No Results Message */}
              {products.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No products found matching your criteria.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
