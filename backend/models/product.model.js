import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: 1000,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },
    discountPercent: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    images: [
      {
        url: String,
        alt: String,
        publicId: String,
      },
    ],
    // Variants array - each product has at least one variant
    // variants: [
    //   {
    //     title: {
    //       type: String,
    //       required: [true, "Variant title is required"],
    //       trim: true,
    //     },
    //     shortDescription: {
    //       type: String,
    //       maxlength: 200,
    //       required: false,
    //     },
    //     variantType: {
    //       type: String,
    //       enum: ["color", "size", "default", "shade", "design"],
    //       default: "default",
    //     },
    //     images: [
    //       {
    //         url: String,
    //         alt: String,
    //         publicId: String,
    //       },
    //     ],
    //     inventory: {
    //       quantity: {
    //         type: Number,
    //         required: true,
    //         min: 0,
    //         default: 0,
    //       },
    //       inStock: {
    //         type: Boolean,
    //         default: true,
    //       },
    //     },
    //   },
    // ],
    // Computed total inventory (calculated from variants)
    inventory: {
      quantity: {
        type: Number,
        default: 0,
      },
      inStock: {
        type: Boolean,
        default: false,
      },
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
productSchema.index({ category: 1, status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ "inventory.inStock": 1 });

export const Product = mongoose.model("Product", productSchema);
