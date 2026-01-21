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


router.post("/", createUser);
router.get("/:id", authenticateUser, getUserById);
router.put("/:id", authenticateUser, updateUser);
router.get("/", authenticateUser, authorizeRole("admin"), getUsers);
router.delete("/:id", authenticateUser, authorizeRole("admin"), deleteUser);

export default router;
