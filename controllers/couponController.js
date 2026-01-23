import Coupon from "../models/coupon.js";

export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCoupons = async (req, res) => {
  const coupons = await Coupon.find();
  res.json(coupons);
};

export const getCouponByCode = async (req, res) => {
  const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase() });

  if (!coupon) {
    return res.status(404).json({ message: "Coupon not found" });
  }

  res.json(coupon);
};

export const updateCoupon = async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(coupon);
};

export const deleteCoupon = async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ message: "Coupon deleted" });
};
