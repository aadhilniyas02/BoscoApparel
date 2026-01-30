"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useLazyGetProductsQuery,
} from "../redux/features/products/productApi";
import { Product } from "../redux/features/products/types";
import { Skeleton } from "@/components/ui/skeleton";
import defaultimg from '../../../public/HeroImages/defaultimg.png'

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [trigger, { data, isLoading }] = useLazyGetProductsQuery();
  const [localLoading, setLocalLoading] = useState(false);
  const router = useRouter();


  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        setLocalLoading(true); // show skeleton immediately
        trigger(
          {
            category: "all",
            page: 1,
            limit: 10,
            search: searchQuery,
          },
          true
        ).finally(() => {
          setLocalLoading(false); // stop skeleton after request resolves
        });
      } else {
        setFilteredProducts([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, trigger]);


  useEffect(() => {
    if (isLoading) {
      setFilteredProducts([]);
    } else if (data?.products) {
      setFilteredProducts(data.products);
    }
  }, [isLoading, data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="flex flex-1 items-center gap-2">
        <Input
          type="text"
          placeholder="Search Products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus-visible:ring-white/20"
        />
        <Button type="submit" size="icon" variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white">
          <Search className="w-5 h-5" />
        </Button>
      </form>
      {searchQuery && (
        <div className="absolute top-full left-0 mt-2 w-full bg-background border border-white/10 rounded-lg shadow-xl max-h-64 overflow-y-auto z-50">
          {localLoading || isLoading ? (
            <div className="p-3 space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-md bg-white/10" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-32 bg-white/10" />
                    <Skeleton className="h-3 w-20 bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : data && data.products?.length > 0 ? (
            data.products.map((product) => (
              <div
                key={product._id}
                className="flex items-center gap-3 p-2 hover:bg-white/10 cursor-pointer text-white"
                onClick={() => {
                  router.push(`/products/${product._id}`);
                  setSearchQuery("");
                }}
              >
                <img
                  src={product.images[0]?.url || defaultimg.src}
                  alt={product.images[0]?.alt || product.name}
                  className="w-12 h-12 object-cover rounded-md"
                />

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">{product.name}</span>
                  <div className="text-gray-400 text-sm">
                    Rs {product.price}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="p-2 text-sm text-gray-400">No products found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

