"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, Save, ArrowLeft, Trash2, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useCreateProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/app/redux/features/products/productApi";
import { useGetCategoriesQuery } from "@/app/redux/features/category/categoryApi";
import {
  ProductFormData,
  ProductImage,
} from "@/app/redux/features/products/types";
import toast from "react-hot-toast";

export default function ProductCreateEditPage() {
  const router = useRouter();
  const params = useParams();
  const isEditMode = params?.id && params.id !== "create";
  const productId = params?.id as string;

  const {
    data: productResponse,
    isLoading: productLoading,
    error: productError,
  } = useGetProductByIdQuery(productId, { skip: !isEditMode });

  const {
    data: categoriesResponse,
    error,
    isLoading: categoriesLoading,
  } = useGetCategoriesQuery();
  const categories = categoriesResponse?.categories || [];

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    category: "",
    discountPercent: 0,
    quantity: 0,
    images: [],
    imagesToDelete: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedProductData, setHasLoadedProductData] = useState(false);

  useEffect(() => {
    if (
      isEditMode &&
      productResponse?.product &&
      !productLoading &&
      categories.length > 0 &&
      !hasLoadedProductData
    ) {
      const product = productResponse.product;
      const categoryId =
        typeof product.category === "string"
          ? product.category
          : product.category?._id || product.category?.id;

      const categoryExists = categories.some(
        (cat: any) => (cat._id || cat.id) === categoryId
      );

      if (categoryId && categoryExists) {
        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          category: categoryId,
          discountPercent: product.discountPercent || 0,
          quantity: product.inventory?.quantity || 0,
          images: product.images || [],
          imagesToDelete: [],
        });
        setHasLoadedProductData(true);
      }
    }
  }, [
    isEditMode,
    productResponse,
    productLoading,
    categories,
    hasLoadedProductData,
  ]);

  const handleInputChange = (field: string, value: any) => {
    if (field === "category" && value === "" && formData.category !== "") {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          const newImage: ProductImage = {
            url: imageUrl,
            alt: formData.name || "Product image",
            publicId: `temp_${Date.now()}_${Math.random()}`,
            file: file,
          };

          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, newImage],
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => {
      const imageToRemove = prev.images[index];
      let updatedImagesToDelete = prev.imagesToDelete;

      if (
        imageToRemove.publicId &&
        !imageToRemove.publicId.startsWith("temp_")
      ) {
        updatedImagesToDelete = [...prev.imagesToDelete, imageToRemove.publicId];
      }

      const updatedImages = prev.images.filter((_, i) => i !== index);

      return {
        ...prev,
        images: updatedImages,
        imagesToDelete: updatedImagesToDelete,
      };
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (
        !formData.name ||
        !formData.description ||
        !formData.price ||
        !formData.category
      ) {
        toast.error("Please fill in all required fields");
        setIsLoading(false);
        return;
      }

      if (formData.quantity === undefined || formData.quantity === null || parseInt(formData.quantity.toString()) < 0) {
        toast.error("Stock quantity is required and must be 0 or greater");
        setIsLoading(false);
        return;
      }

      if (formData.images.length === 0) {
        toast.error("At least one image is required");
        setIsLoading(false);
        return;
      }

      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("price", formData.price.toString());
      submitData.append("category", formData.category);
      submitData.append("discountPercent", formData.discountPercent.toString());
      submitData.append("quantity", formData.quantity.toString());

      // Append image files
      formData.images.forEach((image) => {
        if (image.file) {
          submitData.append("images", image.file);
        }
      });

      // Append images to delete
      if (isEditMode && formData.imagesToDelete.length > 0) {
        submitData.append(
          "imagesToDelete",
          JSON.stringify(formData.imagesToDelete)
        );
      }

      if (isEditMode) {
        await updateProduct({ id: productId, data: submitData }).unwrap();
        toast.success("Product updated successfully!");
      } else {
        await createProduct(submitData).unwrap();
        toast.success("Product created successfully!");
      }

      router.push("/admin/products");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Error submitting form. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (categoriesLoading || (isEditMode && productLoading)) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || (isEditMode && productError)) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Failed to load data</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4 bg-white text-black hover:bg-gray-200"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="border-white/10 hover:bg-white/10 text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {isEditMode ? "Edit Product" : "Create New Product"}
              </h1>
              <p className="text-gray-400">
                {isEditMode
                  ? "Update your product details"
                  : "Add a new product to your catalog"}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-white/10 bg-white/5 shadow-none">
            <CardHeader className="bg-white/5 border-b border-white/10">
              <CardTitle className="text-white">
                Basic Information
              </CardTitle>
              <CardDescription className="text-gray-400">
                Enter the basic details of your product
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">
                    Product Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-white/20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-gray-300">
                    Category *
                  </Label>
                  {categories.length > 0 && (
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleInputChange("category", value)
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-white/20">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category: any) => (
                          <SelectItem
                            key={category._id || category.id}
                            value={category._id || category.id}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter product description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-white/20 min-h-[100px]"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card className="border-white/10 bg-white/5 shadow-none">
            <CardHeader className="bg-white/5 border-b border-white/10">
              <CardTitle className="text-white">Pricing & Inventory</CardTitle>
              <CardDescription className="text-gray-400">Set pricing and stock information</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-gray-300">
                    Price (Rs) *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    // step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-white/20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount" className="text-gray-300">
                    Discount (%)
                  </Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={formData.discountPercent}
                    onChange={(e) =>
                      handleInputChange("discountPercent", e.target.value)
                    }
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-gray-300">Stock Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={(e) =>
                      handleInputChange("quantity", e.target.value)
                    }
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-white/20"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="border-white/10 bg-white/5 shadow-none pb-20">
            <CardHeader className="bg-white/5 border-b border-white/10">
              <CardTitle className="text-white">
                Product Images
              </CardTitle>
              <CardDescription className="text-gray-400">
                Upload images for the product
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="images-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/20 border-dashed rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-300">
                      <span className="font-semibold">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG or JPEG (MAX. 5MB)
                    </p>
                  </div>
                  <input
                    id="images-upload"
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-white/10"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>


          {/* Images to Delete Notice */}
          {formData.imagesToDelete.length > 0 && (
            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400 font-medium">
                {formData.imagesToDelete.length} image(s) will be deleted when
                you save
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pb-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="border-white/10 hover:bg-white/10 text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isCreating || isUpdating}
              className="bg-white text-black hover:bg-gray-200"
            >
              {isLoading || isCreating || isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? "Update Product" : "Create Product"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div >
  );
}
