import { Order } from "../models/order.model.js";
import { ShippingData } from "../models/shippingData.model.js";
import { Product } from "../models/product.model.js";

export const createOrder = async (req, res) => {
  try {
    const { items, shippingData, paymentType, subtotal, shipping, total } =
      req.body;

    // Validate fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Items are required",
      });
    }

    if (!shippingData) {
      return res.status(400).json({
        success: false,
        message: "Shipping data is required",
      });
    }

    // Create shipping document
    const newShippingData = await ShippingData.create(shippingData);

    // Prepare order items
    const orderItems = items.map((item) => ({
      productId: item.productId,
      qty: item.qty,
    }));

    console.log(orderItems);

    // ✅ Adjust inventory per product
    for (const item of orderItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found with ID: ${item.productId}`,
        });
      }

      // Check stock
      if (product.inventory.quantity < item.qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      // Reduce inventory
      product.inventory.quantity -= item.qty;
      product.inventory.inStock = product.inventory.quantity > 0;

      await product.save();
    }

    // Create the order
    const order = await Order.create({
      items: orderItems.map((item) => item),
      shippingData: newShippingData._id,
      paymentType,
      subtotal,
      shipping,
      total,
    });

    await order.populate("shippingData");

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        order,
        shippingDataId: newShippingData._id,
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create order",
    });
  }
};
// Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    // ✅ Extract and safely parse query params
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const { status, search } = req.query;

    const query = {};

    // ✅ Filter by status
    if (status && status !== "All") {
      query.status = status;
    }

    // ✅ Search filter (case-insensitive)
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { orderNumber: searchRegex },
        { paymentType: searchRegex },
        { paymentStatus: searchRegex },
        { "shippingData.name": searchRegex },
        { "shippingData.email": searchRegex },
        { "shippingData.phone": searchRegex },
      ];
    }

    // ✅ Pagination
    const skip = (page - 1) * limit;

    // ✅ Fetch orders
    const orders = await Order.find(query)
      .populate({
        path: "shippingData",
        select: "name email phone",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Order.countDocuments(query);

    const formattedOrders = orders.map((order) => ({
      id: order._id,
      orderNumber: order.orderNumber,
      customerName: order.shippingData?.name || "Unknown Customer",
      email: order.shippingData?.email || "No Email",
      phone: order.shippingData?.phone || "No Phone",
      paymentType: order.paymentType,
      paymentStatus: order.paymentStatus,
      amount: order.total || 0,
      status: order.status,
      date: order.createdAt
        ? new Date(order.createdAt).toISOString().split("T")[0]
        : "",
    }));

    const totalPages = Math.ceil(total / limit);
    const pagination = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    res.status(200).json({
      success: true,
      data: formattedOrders,
      pagination,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch orders",
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({ orderNumber: id })
      .populate({
        path: "items.productId",
        model: "Product",
        select: "name price images",
      })
      .populate("shippingData");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch order",
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;
    console.log(id, status, paymentStatus);

    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("shippingData");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update order",
    });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status === "delivered") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel delivered orders",
      });
    }

    order.status = "cancelled";
    order.cancelReason = reason || "Cancelled by user";
    order.cancelledAt = new Date();

    await order.save();
    await order.populate("shippingData");

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel order",
    });
  }
};

// Get shipping data by ID
export const getShippingDataById = async (req, res) => {
  try {
    const { id } = req.params;

    const shippingData = await ShippingData.findById(id);

    if (!shippingData) {
      return res.status(404).json({
        success: false,
        message: "Shipping data not found",
      });
    }

    res.status(200).json({
      success: true,
      data: shippingData,
    });
  } catch (error) {
    console.error("Get shipping data error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch shipping data",
    });
  }
};
