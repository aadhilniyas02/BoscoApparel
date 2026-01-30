import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/imagesUtils.js";

export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      featured,
      search,
      minPrice,
      maxPrice,
      sort = "-createdAt",
    } = req.query;

    const query = { status: "active" };

    // Filter by category
    if (category) {
      const categoryDoc = await Category.findOne({
        name: new RegExp(category, "i"),
      });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    // Filter by featured
    if (featured !== undefined) {
      query.featured = featured === "true";
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query)
      .populate("category", "name")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);
    const totalActive = await Product.countDocuments({ status: "active" });
    res.json({
      success: true,
      count: products.length,
      total,
      totalActive,
      page: Number(page),
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name description"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, discountPercent, quantity } =
      req.body;

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }

    // Process uploaded files
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await uploadToCloudinary(
            file.buffer,
            "ecommerce/products"
          );
          images.push({
            url: result.secure_url,
            alt: name || "Product image",
            publicId: result.public_id,
          });
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
        }
      }
    }

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      images,
      inventory: {
        quantity: parseInt(quantity) || 0,
        inStock: (parseInt(quantity) || 0) > 0,
      },
      discountPercent: parseFloat(discountPercent) || 0,
      status: "active",
    });

    const createdProduct = await product.save();
    await createdProduct.populate("category", "name description");

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: createdProduct,
    });
  } catch (error) {
    console.error("Create product error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Product with this name already exists",
      });
    }
    res.status(400).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      discountPercent,
      status,
      quantity,
      imagesToDelete,
    } = req.body;

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if category exists (if provided)
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    // Handle image deletions from Cloudinary
    let updatedImages = [...product.images];
    const imagesToDeleteArray = Array.isArray(imagesToDelete)
      ? imagesToDelete
      : imagesToDelete
        ? JSON.parse(imagesToDelete)
        : [];

    if (imagesToDeleteArray.length > 0) {
      for (const publicId of imagesToDeleteArray) {
        try {
          await deleteFromCloudinary(publicId);
        } catch (deleteError) {
          console.error(`Error deleting image ${publicId}:`, deleteError);
        }
      }
      // Remove deleted images from product.images
      updatedImages = updatedImages.filter(
        (img) => !imagesToDeleteArray.includes(img.publicId)
      );
    }

    // Process uploaded files
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await uploadToCloudinary(
            file.buffer,
            "ecommerce/products"
          );
          updatedImages.push({
            url: result.secure_url,
            alt: name || product.name,
            publicId: result.public_id,
          });
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
        }
      }
    }

    // Update fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? parseFloat(price) : product.price;
    product.category = category || product.category;
    product.status = status || product.status;
    product.images = updatedImages;
    product.discountPercent =
      discountPercent !== undefined
        ? parseFloat(discountPercent)
        : product.discountPercent;

    if (quantity !== undefined) {
      product.inventory = {
        quantity: parseInt(quantity) || 0,
        inStock: (parseInt(quantity) || 0) > 0,
      };
    }

    const updatedProduct = await product.save();
    await updatedProduct.populate("category", "name description");

    res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Product with this name already exists",
      });
    }
    res.status(400).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const updateInventory = async (req, res) => {
  try {
    const { quantity } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.inventory.quantity = quantity;
    product.inventory.inStock = quantity > 0;

    await product.save();

    res.json({
      success: true,
      message: "Inventory updated successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating inventory",
      error: error.message,
    });
  }
};

export const getNewArrivals = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const products = await Product.find()
      .populate("category", "name description")
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
