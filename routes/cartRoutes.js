import express from "express";
import { addToCart, getCart, updateCartItem, clearCart , getsingleCart} from "../controllers/cartController.js";
const router = express.Router();

router.post("/", addToCart);
router.get("/", getCart);
router.get("/:id", getsingleCart);
router.put("/update/:id", updateCartItem);
router.delete("/clear/:userId", clearCart);

export default router;
