import express from "express";
import { getDashboardStats, getRecentOrders, getSalesStats } from "../controllers/dashboard.controllers.js";

const router = express.Router();

router.get("/sales-stats", getSalesStats);
router.get("/graph-stats", getDashboardStats);
router.get("/recent-orders", getRecentOrders);

export default router;
