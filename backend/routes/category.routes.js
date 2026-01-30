import express from "express";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controllers.js";
import { auth } from "../middlewares/auth.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import { uploadSingle } from "../middlewares/upload.js";
const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(auth, adminAuth, uploadSingle, createCategory);

router
  .route("/:id")
  .get(getCategory)
  .put(auth, adminAuth, uploadSingle, updateCategory)
  .delete(auth, adminAuth, deleteCategory);

export default router;
