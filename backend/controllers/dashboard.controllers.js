import { Order } from "../models/order.model.js";
import { Category } from "../models/category.model.js";

export const getSalesStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    console.log("api calliong");

    const totalSalesAgg = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$total" } } },
    ]);
    const totalSales = totalSalesAgg[0]?.totalSales || 0;

    const [paidOrders, pendingOrders, cancelledOrders] = await Promise.all([
      Order.countDocuments({ paymentStatus: "paid" }),
      Order.countDocuments({ paymentStatus: "pending" }),
      Order.countDocuments({ status: "cancelled" }),
    ]);

    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalSales,
        paidOrders,
        pendingOrders,
        cancelledOrders,
        monthlySales,
      },
    });
  } catch (error) {
    console.error("Get sales stats error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch sales stats",
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    // ========== BASIC COUNTS ==========
    const totalOrders = await Order.countDocuments();
    const activeCustomers = await Order.distinct("shippingData").then(
      (customers) => customers.length
    );

    // ========== TOTAL SALES ==========
    const totalSalesAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);
    const totalSales = totalSalesAgg[0]?.total || 0;

    // ========== DAILY, MONTHLY, YEARLY SALES ==========
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [dailySales, monthlySales, yearlySales] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfDay } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfYear } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
    ]);

    // ========== MONTHLY REVENUE TREND ==========
    const revenue = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const formattedRevenue = monthNames.map((m, i) => ({
      month: m,
      revenue: revenue.find((r) => r._id === i + 1)?.revenue || 0,
    }));

    // ========== CATEGORY DISTRIBUTION ==========
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          as: "products",
        },
      },
      {
        $project: {
          name: 1,
          count: { $size: "$products" },
        },
      },
    ]);

    const formattedCategories = categories.map((c, index) => ({
      name: c.name,
      value: c.count,
      color: ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00C49F"][index % 5],
    }));

    // ========== PAYMENT METHODS ==========
    const paymentMethodsAgg = await Order.aggregate([
      {
        $group: {
          _id: "$paymentType",
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedPayments = paymentMethodsAgg.map((p, index) => ({
      name:
        p._id === "cod"
          ? "Cash on Delivery"
          : p._id === "bank"
          ? "Bank Transfer"
          : p._id,
      value: p.count,
      color: ["#8884d8", "#82ca9d", "#ffc658", "#ff7300"][index % 4],
    }));

    // ========== TOP PRODUCTS ==========
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.qty" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      { $project: { name: "$product.name", totalSold: 1 } },
    ]);

    // ========== FINAL RESPONSE ==========
    res.status(200).json({
      success: true,
      data: {
        totalSales: {
          daily: dailySales[0]?.total || 0,
          monthly: monthlySales[0]?.total || 0,
          yearly: yearlySales[0]?.total || 0,
          change: "+12.5%", // (you can compute growth logic later)
        },
        totalOrders,
        activeCustomers,
        topSellingProducts: topProducts[0]?.name || "N/A",
        revenue: formattedRevenue,
        categories: formattedCategories,
        paymentMethods: formattedPayments,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch dashboard stats",
    });
  }
};

export const getRecentOrders = async (req, res) => {
  try {
    // Fetch latest 10 orders and include shipping info
    const orders = await Order.find()
      .populate({
        path: "shippingData",
        select: "name email phone",
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Format the response
    const formattedOrders = orders.map((order) => ({
      id: order._id,
      orderNumber : order.orderNumber,
      customerName: order.shippingData?.name || "Unknown Customer",
      email: order.shippingData?.email || "No Email",
      phone: order.shippingData?.phone || "No Phone",
      paymentType: order.paymentType,
      amount: order.total || 0,
      status: order.status,
      date: order.createdAt?.toISOString().split("T")[0],
    }));

    res.status(200).json({
      success: true,
      data: formattedOrders,
    });
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent orders",
    });
  }
};
