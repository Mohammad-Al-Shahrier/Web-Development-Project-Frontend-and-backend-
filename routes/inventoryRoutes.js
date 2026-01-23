import express from "express";
import {
  createInventory,
  getInventories,
  updateInventory,
  deleteInventory,
} from "../controllers/inventoryController.js";

import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = express.Router();

router.post("/", authenticateUser, authorizeRole("admin"), createInventory);
router.get("/", authenticateUser, authorizeRole("admin"), getInventories);
router.put("/:id", authenticateUser, authorizeRole("admin"), updateInventory);
router.delete("/:id", authenticateUser, authorizeRole("admin"), deleteInventory);

export default router;
