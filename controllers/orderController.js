import Order from "../models/order.js";

export const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      status,
      sort,
      user,
      minPrice,
      maxPrice,
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    const query = {};

    if (status) {
      query.status = status;
    }

    if (user) {
      query.user = user;
    }

    if (minPrice || maxPrice) {
      query.totalPrice = {};
      if (minPrice) query.totalPrice.$gte = Number(minPrice);
      if (maxPrice) query.totalPrice.$lte = Number(maxPrice);
    }

    const skip = (page - 1) * limit;

    let sortOption = {};
    if (sort) {
      sortOption[sort.replace("-", "")] = sort.startsWith("-") ? -1 : 1;
    } else {
      sortOption = { createdAt: -1 };
    }

    const orders = await Order.find(query)
      .populate("user")
      .populate("products.product")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      count: orders.length,
      orders,
    });
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
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
