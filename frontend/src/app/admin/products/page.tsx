"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Image as ImageIcon,
  Star,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useDeleteProductMutation,
  // useDeleteProductMutation,
  useGetProductsQuery,
} from "@/app/redux/features/products/productApi";
import { Product, ProductsResponse } from "@/app/redux/features/products/types";
import { useGetCategoriesQuery } from "@/app/redux/features/category/categoryApi";
import { DeleteModal } from "@/app/componenets/DeleteModal";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();
  const [deleteProduct, { isLoading: deleteloading }] =
    useDeleteProductMutation();

  // const { data, isLoading, error } = useGetProductsQuery();
  const [page, setPage] = useState<number>(1);
  const limit = 10;
  const { data, isLoading, error } = useGetProductsQuery({
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    search: searchTerm || undefined,
    page: page,
    limit: limit,
  });

  const productsResponse = data as unknown as ProductsResponse;
  const pages = productsResponse?.pages || 1;
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch,
  } = useGetCategoriesQuery();

  const categories = categoriesData?.categories || [];
  // Use actual API data or empty array as fallback
  const products = productsResponse?.products || [];

  // Filter products based on search and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product._id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || product.category.name === categoryFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "in-stock" && product.inventory?.inStock) ||
      (statusFilter === "out-of-stock" && !product.inventory?.inStock) ||
      (statusFilter === "low-stock" &&
        product.inventory?.quantity < 20 &&
        product.inventory?.quantity > 0);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate stats from actual data
  const totalProducts = productsResponse?.total || 0;
  const activeProducts = productsResponse?.totalActive || 0;
  const lowStockProducts = products.filter(
    (product) =>
      product.inventory?.quantity < 20 &&
      product.inventory?.quantity > 0
  ).length;

  const totalRevenue = products.reduce((sum, product) => {
    // Since we don't have sales data in the API, we'll use a mock sales count based on stock
    const mockSales = Math.max(0, 100 - product.inventory?.quantity);
    // return sum + product.price * mockSales;
    return 0;
  }, 0);

  const addProduct = () => {
    router.push("/admin/products/create");
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center text-red-600">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <p>Error loading products. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (deleteloading) {
    return <div>loading....</div>;
  }

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteProduct(id).unwrap();
      toast.success("Product Deleted Successfullly!");
    } catch (err: any) {
      console.error("error:", err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Product Management
          </h1>
          <p className="text-gray-400">Manage your cosmetics product catalog</p>
        </div>
        <div className="flex items-center space-x-2">
          {/* <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button> */}
          <Button
            onClick={addProduct}
            size="sm"
            className="cursor-pointer text-black bg-white hover:bg-gray-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-white">
                  {totalProducts}
                </p>
              </div>
              <Package className="h-8 w-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Active Products
                </p>
                <p className="text-2xl font-bold text-white">
                  {activeProducts}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Low Stock</p>
                <p className="text-2xl font-bold text-white">
                  {lowStockProducts}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-white">
                  LKR {totalRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-gray-400">Product</TableHead>
                <TableHead className="text-gray-400">Category</TableHead>
                <TableHead className="text-gray-400">Price</TableHead>
                <TableHead className="text-gray-400">Stock</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Created</TableHead>
                <TableHead className="text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product._id} className="border-white/10 hover:bg-white/5">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-white">{product.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-gray-300 border-gray-600">{product.category.name}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-white">
                      LKR {product.price.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 text-white">
                        <span className="text-sm">
                          {product.inventory?.quantity || 0}
                        </span>
                        {/* {getStockBadge(product.inventory.quantity)} */}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(
                        product.inventory?.inStock || false,
                        product.inventory?.quantity || 0
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-400">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {/* <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button> */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/admin/products/${product._id}`)
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <DeleteModal
                          onDelete={() => handleDelete(product._id)}
                          isLoading={deleteloading}
                          title="Are you sure you want to delete this product?"
                          description="This action cannot be undone."
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DeleteModal>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-500"
                  >
                    No products found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <span className="text-sm text-gray-600">
              Page {page || 1} of {pages || 1}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={page === pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
const getStatusBadge = (inStock: boolean, quantity: number) => {
  if (quantity === 0) {
    return <Badge variant="destructive">Out of Stock</Badge>;
  } else if (quantity < 20) {
    return (
      <Badge variant="warning" className="flex items-center space-x-1">
        <AlertTriangle className="h-3 w-3" />
        Low Stock
      </Badge>
    );
  } else {
    return <Badge variant="success">In Stock</Badge>;
  }
};
