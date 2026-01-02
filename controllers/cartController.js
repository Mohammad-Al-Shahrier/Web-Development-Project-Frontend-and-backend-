import Cart from "../models/cart.js";
import Product from "../models/product.js";

/**
 * @desc    Add items to cart (Create or Update)
 * @route   POST /api/carts
 * @access  Private (User)
 */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart items are required" });
    }

    // Validate products
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.product}`,
        });
      }
    }

    // Check if cart already exists
    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      // Update existing cart
      items.forEach((newItem) => {
        const existingItem = cart.items.find(
          (item) => item.product.toString() === newItem.product
        );

        if (existingItem) {
          existingItem.quantity += newItem.quantity;
        } else {
          cart.items.push(newItem);
        }
      });
    } else {
      // Create new cart
      cart = new Cart({
        user: userId,
        items,
      });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Get logged-in user's cart
 * @route   GET /api/carts
 * @access  Private (User)
 */
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Get single cart by ID (Admin or Owner)
 * @route   GET /api/carts/:id
 * @access  Private
 */
export const getsingleCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id).populate("items.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Allow only owner or admin
    if (
      cart.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/carts/update/:itemId
 * @access  Private (User)
 */
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
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Clear logged-in user's cart
 * @route   DELETE /api/carts/clear
 * @access  Private (User)
 */
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
