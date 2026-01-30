import express from "express";
import mongoose, { connect } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Category } from "./models/category.model.js";
import { User } from "./models/user.model.js";
import { Product } from "./models/product.model.js";
// Routes
import userRouters from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import connectDB from "./config/connectDB.js";
import orderRoutes from "./routes/orders.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";


dotenv.config();
connectDB();
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://boscoapparel.vercel.app"],
    credentials: true, // allow cookies / tokens
  })
);
// app.use(express.json({ limit: "10mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


// Routes
app.use("/api/auth", userRouters);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);


// Server Running
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
