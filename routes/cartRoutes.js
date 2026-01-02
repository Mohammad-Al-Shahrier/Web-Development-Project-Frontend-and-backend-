import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  clearCart,
  getsingleCart,
} from "../controllers/cartController.js";

import { authenticateUser } from "../middlewares/authenticateUser.js";

const router = express.Router();

router.post("/", authenticateUser, addToCart);
router.get("/", authenticateUser, getCart);
router.get("/:id", authenticateUser, getsingleCart);
router.put("/update/:itemId", authenticateUser, updateCartItem);
router.delete("/clear", authenticateUser, clearCart);

export default router;
