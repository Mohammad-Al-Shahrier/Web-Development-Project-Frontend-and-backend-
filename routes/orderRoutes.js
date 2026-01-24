import express from "express";
import {
  createOrder,
  createOrderFromCart,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = express.Router();

router.post("/", authenticateUser, createOrder);
router.post("/cart", authenticateUser, createOrderFromCart);

router.get("/:id", authenticateUser, getOrderById);
router.get("/", authenticateUser, authorizeRole("admin"), getOrders);
router.patch("/:id", authenticateUser, authorizeRole("admin"), updateOrder);
router.delete("/:id", authenticateUser, authorizeRole("admin"), deleteOrder);

export default router;
