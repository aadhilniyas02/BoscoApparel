import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  qty: {
    type: Number,
    required: true,
    min: 1,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    items: [orderItemSchema],
    shippingData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShippingData",
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["cod", "bank"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "dispatched",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    subtotal: {
      type: Number,
      required: true,
    },
    shipping: {
      type: Number,
      required: true,
      default: 499,
    },
    total: {
      type: Number,
      required: true,
    },
    cancelReason: {
      type: String,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Generate order number before saving
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model("Order").countDocuments();

    const nextNumber = count + 1;

    this.orderNumber = `eb${String(nextNumber).padStart(3, "0")}`;
  }

  next();
});

export const Order = mongoose.model("Order", orderSchema);
