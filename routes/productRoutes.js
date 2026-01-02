import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = express.Router();

// ✅ PUBLIC
router.get("/", getProducts);
router.get("/:id", getProductById);

// ✅ ADMIN ONLY
router.post("/", authenticateUser, authorizeRole("admin"), createProduct);
router.put("/:id", authenticateUser, authorizeRole("admin"), updateProduct);
router.delete("/:id", authenticateUser, authorizeRole("admin"), deleteProduct);

export default router;
