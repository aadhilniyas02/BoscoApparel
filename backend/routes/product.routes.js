import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateInventory,
  getNewArrivals
} from "../controllers/product.controllers.js";
import { auth } from "../middlewares/auth.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import { uploadMultiple } from "../middlewares/upload.js";

const router = express.Router();
router.get("/new-arrivals", getNewArrivals);

router
  .route("/")
  .get(getProducts)
  .post(auth, adminAuth, uploadMultiple, createProduct);

router
  .route("/:id")
  .get(getProduct)
  .put(auth, adminAuth, uploadMultiple, updateProduct)
  .delete(auth, adminAuth, deleteProduct);

router.route("/:id/inventory").patch(auth, adminAuth, updateInventory);


export default router;
