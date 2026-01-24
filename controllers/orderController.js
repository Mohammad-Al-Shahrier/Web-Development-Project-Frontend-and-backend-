import Order from "../models/order.js";
import Product from "../models/product.js";
import Cart from "../models/cart.js";
import Coupon from "../models/coupon.js";

export const createOrder = async (req, res) => {
  try {
    const { products, shippingAddress, paymentMethod, totalPrice } = req.body;

    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product)
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      if (product.stock < item.quantity)
        return res.status(400).json({ message: `${product.name} is out of stock` });

      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      user: req.user._id,
      products,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createOrderFromCart = async (req, res) => {
  try {
    const { couponCode, shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    let totalPrice = 0;
    const products = [];

    for (const item of cart.items) {
      const product = item.product;

      if (product.stock < item.quantity)
        return res.status(400).json({ message: `${product.name} is out of stock` });

      product.stock -= item.quantity;
      await product.save();

      products.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      totalPrice += product.price * item.quantity;
    }

    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiryDate: { $gte: new Date() },
      });

      if (!coupon) return res.status(400).json({ message: "Invalid or expired coupon" });
      if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit)
        return res.status(400).json({ message: "Coupon usage limit exceeded" });
      if (totalPrice < coupon.minOrderAmount)
        return res.status(400).json({
          message: `Minimum order amount is ${coupon.minOrderAmount}`,
        });

      discount =
        coupon.discountType === "percentage"
          ? Math.min((totalPrice * coupon.discountValue) / 100, coupon.maxDiscount || Infinity)
          : coupon.discountValue;

      totalPrice -= discount;

      coupon.usedCount += 1;
      await coupon.save();
    }

    const order = await Order.create({
      user: req.user._id,
      products,
      totalPrice,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
    });

    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json({
      message: "Order placed successfully from cart",
      discountApplied: discount,
      finalPrice: totalPrice,
      order,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("products.product");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate("products.product");

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
