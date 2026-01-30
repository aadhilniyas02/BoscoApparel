import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getShippingDataById,
} from "../controllers/orders.controllers.js";

const router = express.Router();

// Public routes
router.post("/", createOrder);
router.get("/:id", getOrderById);
router.post("/:id/cancel", cancelOrder);

// Shipping data route
router.get("/shipping/:id", getShippingDataById);

// Admin routes (add auth middleware as needed)
router.get("/", getAllOrders);
router.put("/:id/status", updateOrderStatus);

export default router;
