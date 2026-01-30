import express from "express";
import { userController } from "../controllers/user.controllers.js";
import { auth } from "../middlewares/auth.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router();

// Public routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/refresh-token", userController.refreshToken);

// Protected routes (requires authentication)
router.use(auth);

router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);
router.post("/logout", userController.logout);

// Admin only routes
router.get("/all", adminAuth, userController.getAllUsers);
router.delete("/:id", adminAuth, userController.deleteUser);

export default router;
