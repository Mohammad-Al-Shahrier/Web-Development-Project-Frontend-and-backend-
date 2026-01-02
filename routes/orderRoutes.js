import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";

import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = express.Router();

// ✅ USER
router.post("/", authenticateUser, createOrder);
router.get("/:id", authenticateUser, getOrderById);

// ✅ ADMIN
router.get("/", authenticateUser, authorizeRole("admin"), getOrders);
router.put("/:id", authenticateUser, authorizeRole("admin"), updateOrder);
router.delete("/:id", authenticateUser, authorizeRole("admin"), deleteOrder);

export default router;
