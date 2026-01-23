import express from "express";
import {
  createCoupon,
  getCoupons,
  getCouponByCode,
  updateCoupon,
  deleteCoupon,
} from "../controllers/couponController.js";

import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = express.Router();

router.post("/", authenticateUser, authorizeRole("admin"), createCoupon);
router.get("/", authenticateUser, authorizeRole("admin"), getCoupons);
router.get("/:code", authenticateUser, getCouponByCode);
router.put("/:id", authenticateUser, authorizeRole("admin"), updateCoupon);
router.delete("/:id", authenticateUser, authorizeRole("admin"), deleteCoupon);

export default router;
