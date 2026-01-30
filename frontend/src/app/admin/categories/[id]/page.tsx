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
import { Checkbox } from "@/components/ui/checkbox";

import {
  Upload,
  X,
  Save,
  ArrowLeft,
  Image as ImageIcon,
  FolderOpen,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useGetCategoryByIdQuery,
} from "@/app/redux/features/category/categoryApi";
import toast from "react-hot-toast";

interface CategoryImage {
  url: string;
  alt: string;
  publicId: string;
  file?: File;
}

interface CategoryFormData {
  name: string;
  description: string;
  image: CategoryImage | null;
  isActive: boolean;
  featured: boolean;
  displayOrder: number | string;
}

export default function CategoryCreateEditPage() {
  const router = useRouter();
  const params = useParams();
  const isEditMode = params?.id && params.id !== "create";
  const categoryId = params?.id as string;

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  // Fetch category data for edit mode
  const {
    data: categoryData,
    isLoading: isFetching,
    error: fetchError,
  } = useGetCategoryByIdQuery(categoryId, {
    skip: !isEditMode,
  });

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    image: null,
    isActive: true,
    featured: false,
    displayOrder: 0,
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [hasNewImage, setHasNewImage] = useState(false);

  // Load existing category data in edit mode
  useEffect(() => {
    if (isEditMode && categoryData?.category) {
      const category = categoryData.category;
      setFormData({
        name: category.name || "",
        description: category.description || "",
        image: category.image || null,
        isActive: category.isActive ?? true,
        featured: category.featured ?? false,
        displayOrder: category.displayOrder ?? 0,
      });

      if (category.image?.url) {
        setImagePreview(category.image.url);
      }
    }
  }, [isEditMode, categoryData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const newImage: CategoryImage = {
          url: imageUrl,
          alt: formData.name || "Category image",
          publicId: `temp_${Date.now()}`,
          file: file,
        };

        setFormData((prev) => ({
          ...prev,
          image: newImage,
        }));

        setImagePreview(imageUrl);
        setHasNewImage(true);
        setRemoveExistingImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview("");
    setHasNewImage(false);

    if (isEditMode && categoryData?.category?.image) {
      setRemoveExistingImage(true);
    }

    // Clear the file input
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert("Please fill in the category name");
      return false;
    }

    if (formData.name.trim().length > 50) {
      alert("Category name must be 50 characters or less");
      return false;
    }

    if (formData.description.length > 500) {
      alert("Description must be 500 characters or less");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Prepare form data for submission
      const submitData = new FormData();

      // Append basic fields
      submitData.append("name", formData.name.trim());
      submitData.append("description", formData.description.trim());
      submitData.append("isActive", formData.isActive.toString());
      submitData.append("featured", formData.featured.toString());
      submitData.append(
        "displayOrder",
        Number(formData.displayOrder).toString()
      );

      // Handle image operations
      if (removeExistingImage) {
        submitData.append("removeImage", "true");
      }

      // Append new image file if exists
      if (hasNewImage && formData.image?.file) {
        submitData.append("image", formData.image.file);
      }

      // console.log("Form submitted:", {
      //   name: formData.name.trim(),
      //   description: formData.description.trim(),
      //   isActive: formData.isActive,
      //   featured: formData.featured,
      //   displayOrder: Number(formData.displayOrder),
      //   hasNewImage,
      //   removeExistingImage,
      //   hasImageFile: !!formData.image?.file,
      // });

      if (isEditMode) {
        await updateCategory({ id: categoryId, data: submitData }).unwrap();
        toast.success("Category updated successfully!");
      } else {
        await createCategory(submitData).unwrap();
        toast.success("Category created successfully!");
      }

      router.push("/admin/categories");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      const errorMessage =
        error?.data?.message || "Error submitting form. Please try again.";
      toast.error(errorMessage);
    }
  };

  // Loading state for fetching category data
  if (isEditMode && isFetching) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading category data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isEditMode && fetchError) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading category data</p>
          <Button onClick={() => router.back()} variant="outline" className="border-white/10 text-white hover:bg-white/10">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const isLoading = isCreating || isUpdating;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
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
                {isEditMode ? "Edit Category" : "Create New Category"}
              </h1>
              <p className="text-gray-400">
                {isEditMode
                  ? "Update your category details"
                  : "Add a new category to organize your products"}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-white/10 bg-white/5 shadow-none">
            <CardHeader className="bg-white/5 border-b border-white/10">
              <CardTitle className="text-white flex items-center">
                <FolderOpen className="h-5 w-5 mr-2" />
                Basic Information
              </CardTitle>
              <CardDescription className="text-gray-400">
                Enter the basic details of your category
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">
                    Category Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter category name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-white/20"
                    required
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-500">
                    {formData.name.length}/50 characters
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayOrder" className="text-gray-300">
                    Display Order
                  </Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    placeholder="0"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      handleInputChange("displayOrder", e.target.value)
                    }
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-white/20"
                    min="0"
                  />
                  <p className="text-xs text-gray-500">
                    Lower numbers appear first
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter category description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-white/20 min-h-[100px]"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500">
                  {formData.description.length}/500 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          {/* <Card className="border-green-100 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="text-green-800">
                Category Settings
              </CardTitle>
              <CardDescription>
                Configure category visibility and features
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      handleInputChange("isActive", checked)
                    }
                  />
                  <Label htmlFor="isActive" className="text-green-700">
                    Active Category
                  </Label>
                  <p className="text-sm text-gray-500 ml-2">
                    Only active categories are visible to customers
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      handleInputChange("featured", checked)
                    }
                  />
                  <Label htmlFor="featured" className="text-green-700">
                    Featured Category
                  </Label>
                  <p className="text-sm text-gray-500 ml-2">
                    Featured categories appear prominently on the homepage
                  </p>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Category Image */}
          <Card className="border-white/10 bg-white/5 shadow-none">
            <CardHeader className="bg-white/5 border-b border-white/10">
              <CardTitle className="text-white">Category Image</CardTitle>
              <CardDescription className="text-gray-400">
                Upload a category image (recommended: 600x400px, max 5MB)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {!imagePreview ? (
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="image"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/20 border-dashed rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-300">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG or JPEG (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        id="image"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Category preview"
                        className="w-48 h-32 object-cover rounded-lg border border-white/10"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Show replace image option */}
                    <div className="flex items-center space-x-4">
                      <label
                        htmlFor="image-replace"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-white/10 rounded-md shadow-sm text-sm font-medium text-white bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Replace Image
                      </label>
                      <input
                        id="image-replace"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeImage}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Image
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pb-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="border-white/10 hover:bg-white/10 text-white"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-white text-black hover:bg-gray-200"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? "Update Category" : "Create Category"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
