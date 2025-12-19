import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

import { authenticateUser } from "../middlewares/authenticateUser.js";

const router = express.Router();

// Public
router.post("/", createUser);

// Authenticated only
router.get("/", authenticateUser, getUsers);
router.get("/:id", authenticateUser, getUserById);
router.put("/:id", authenticateUser, updateUser);
router.delete("/:id", authenticateUser, deleteUser);

export default router;
