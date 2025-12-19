import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

import { authenticateUser } from "../middlewares/authenticateUser.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const router = express.Router();

// Public
router.post("/", createUser);

// Admin only
router.get("/", authenticateUser, authorizeRole("admin"), getUsers);
router.delete("/:id", authenticateUser, authorizeRole("admin"), deleteUser);

// User or Admin
router.get("/:id", authenticateUser, getUserById);
router.put("/:id", authenticateUser, updateUser);

export default router;
