// src/routes/roomRoutes.ts
import { Router } from "express";
import * as roomController from "../controllers/roomController";

const router = Router();

router.post("/", roomController.createRoom);
router.get("/:roomId", roomController.getRoom);
// deleteRoom
router.delete("/:roomId", roomController.deleteRoom);
// add more youtube url to room
router.put("/:roomId", roomController.addVideoUrl);
export default router;
