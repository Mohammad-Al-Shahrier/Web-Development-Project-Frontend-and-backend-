import Cart from "../models/cart.js";
import Product from "../models/product.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart items are required" });
    }

    const formattedItems = [];
    let totalPrice = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      formattedItems.push({
        product: product._id,
        quantity: item.quantity,
      });

      totalPrice += product.price * item.quantity;
    }

    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      formattedItems.forEach((newItem) => {
        const existingItem = cart.items.find(
          (item) => item.product.toString() === newItem.product.toString()
        );

        if (existingItem) {
          existingItem.quantity += newItem.quantity;
        } else {
          cart.items.push(newItem);
        }
      });

      totalPrice = 0;
      for (const item of cart.items) {
        const product = await Product.findById(item.product);
        totalPrice += product.price * item.quantity;
      }

      cart.totalPrice = totalPrice;
    } else {
      cart = new Cart({
        user: userId,
        items: formattedItems,
        totalPrice,
      });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getsingleCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id).populate("items.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    if (cart.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    item.quantity = quantity;

    let totalPrice = 0;
    for (const i of cart.items) {
      const product = await Product.findById(i.product);
      totalPrice += product.price * i.quantity;
    }
    cart.totalPrice = totalPrice;

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
