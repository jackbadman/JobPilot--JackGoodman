/**
 * User auth/profile routes.
 */
import express from "express";
import { register, login, getUsers, getMe } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/", getUsers);
router.get("/me", authMiddleware, getMe);

export default router;
