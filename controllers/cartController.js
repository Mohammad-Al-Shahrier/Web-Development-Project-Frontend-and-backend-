import Cart from "../models/cart.js";
import Product from "../models/product.js";
import User from "../models/user.js"

export const addToCart = async (req, res) => {
  try {
    const user=await User.findById(req.body.user);
    if(!user) return res.status(404).json({ message: "User not found" });
    const {items}=req.body;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ error: `Product not found: ${item.product}` });
      }
    }
    const cart= await Cart.create(req.body);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.find().populate("items.product");
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getsingleCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(req.params.id,req.body,{new:true});
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.params.userId });
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
