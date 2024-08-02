// src/routes/userRoutes.ts
import express from "express";
import {
  createUser,
  getUserRooms,
  joinRoom,
  inviteUser,
  getInvitations,
  loginUser,
  getAuthUser,
} from "../controllers/userController";
import { checkAuth } from "../middleware/user";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/:userId/rooms", checkAuth, getUserRooms);
// auth for user information
router.get("/:userId", checkAuth, getAuthUser);

router.post("/:userId/join/:roomId", joinRoom);
router.post("/:userId/invite/:roomId", inviteUser);
router.get("/:userId/invitations", getInvitations);

export default router;
