import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/imagesUtils.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    console.log("Request file:", req.file);
    console.log("Request body:", req.body);

    const { name, description, isActive, featured, displayOrder } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // Check if category with this name already exists
    const categoryExists = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });

    if (categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
    }

    // Handle image upload
    let image = {};
    if (req.file) {
      try {
        const result = await uploadToCloudinary(
          req.file.buffer,
          "ecommerce/categories"
        );
        image = {
          url: result.secure_url,
          alt: name.trim(),
          publicId: result.public_id,
        };
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: "Error uploading image",
          error: uploadError.message,
        });
      }
    }

    // Create category
    const category = new Category({
      name: name.trim(),
      description: description?.trim() || "",
      image: Object.keys(image).length > 0 ? image : undefined,
      isActive: isActive !== undefined ? JSON.parse(isActive) : true,
      featured: featured !== undefined ? JSON.parse(featured) : false,
      displayOrder: displayOrder ? parseInt(displayOrder) : 0,
    });

    const createdCategory = await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: createdCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      success: false,
      message: "Error creating category",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    console.log("Update request file:", req.file);
    console.log("Update request body:", req.body);

    const { name, description, isActive, featured, displayOrder, removeImage } =
      req.body;
    const categoryId = req.params.id;

    // Find existing category
    let category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if name is being changed and if it already exists
    if (name && name.trim() !== category.name) {
      const categoryExists = await Category.findOne({
        name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
        _id: { $ne: categoryId }, // Exclude current category
      });

      if (categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Category with this name already exists",
        });
      }
    }

    // Handle image operations
    let imageUpdate = category.image;

    // Check if we should remove the existing image
    if (removeImage === "true" || removeImage === true) {
      // Delete from cloudinary if exists
      if (category.image?.publicId) {
        try {
          await deleteFromCloudinary(category.image.publicId);
        } catch (deleteError) {
          console.error(
            "Error deleting old image from cloudinary:",
            deleteError
          );
        }
      }
      imageUpdate = undefined;
    }

    // Handle new image upload
    if (req.file) {
      // Delete old image from cloudinary if it exists and we're replacing it
      if (category.image?.publicId && removeImage !== "true") {
        try {
          await deleteFromCloudinary(category.image.publicId);
        } catch (deleteError) {
          console.error(
            "Error deleting old image from cloudinary:",
            deleteError
          );
        }
      }

      try {
        const result = await uploadToCloudinary(
          req.file.buffer,
          "ecommerce/categories"
        );
        imageUpdate = {
          url: result.secure_url,
          alt: name?.trim() || category.name,
          publicId: result.public_id,
        };
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: "Error uploading new image",
          error: uploadError.message,
        });
      }
    }

    // Update category fields
    const updateData = {
      ...(name && { name: name.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(isActive !== undefined && { isActive: JSON.parse(isActive) }),
      ...(featured !== undefined && { featured: JSON.parse(featured) }),
      ...(displayOrder !== undefined && {
        displayOrder: parseInt(displayOrder),
      }),
    };

    // Handle image update
    if (imageUpdate !== category.image) {
      updateData.image = imageUpdate;
    }

    // Update the category
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      success: false,
      message: "Error updating category",
      error: error.message,
    });
  }
};
export const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Get products in this category
    const products = await Product.find({
      category: category._id,
      status: "active",
    }).select("name price images inventory");

    res.json({
      success: true,
      category: {
        ...category.toObject(),
        productsCount: products.length,
      },
      products,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if category has products
    const productsCount = await Product.countDocuments({
      category: category._id,
    });
    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. There are ${productsCount} products associated with it.`,
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
