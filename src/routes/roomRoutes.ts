// src/routes/roomRoutes.ts
import { Router } from "express";
import {
  addVideoUrl,
  createRoom,
  deleteRoom,
  deleteVideo,
  getRoom,
} from "../controllers/roomController";
import { checkAuth } from "../middleware/user";

const router = Router();

router.post("/create", checkAuth, createRoom);
router.put("/:roomId/addVideo", checkAuth, addVideoUrl);
router.get("/:roomId", getRoom);
router.delete("//:roomId", checkAuth, deleteRoom);
// delete particular video from room
router.delete("/delete-video/:roomId/", checkAuth, deleteVideo);

export default router;
