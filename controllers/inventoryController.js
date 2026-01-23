import Inventory from "../models/inventory.js";
import Product from "../models/product.js";

export const createInventory = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    const existing = await Inventory.findOne({ product });
    if (existing) {
      return res.status(400).json({ message: "Inventory already exists" });
    }

    const inventory = await Inventory.create({ product, quantity });

    await Product.findByIdAndUpdate(product, { stock: quantity });

    res.status(201).json(inventory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getInventories = async (req, res) => {
  const inventories = await Inventory.find().populate("product");
  res.json(inventories);
};

export const updateInventory = async (req, res) => {
  const { quantity } = req.body;

  const inventory = await Inventory.findByIdAndUpdate(
    req.params.id,
    { quantity },
    { new: true }
  );

  await Product.findByIdAndUpdate(inventory.product, {
    stock: inventory.quantity,
  });

  res.json(inventory);
};

export const deleteInventory = async (req, res) => {
  await Inventory.findByIdAndDelete(req.params.id);
  res.json({ message: "Inventory removed" });
};
