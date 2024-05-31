// src/controllers/roomController.ts
import { Request, Response } from "express";
import * as roomService from "../services/roomService";
import { RequestExtended } from "../middleware/user";

export const createRoom = async (req: RequestExtended, res: Response) => {
  const { videoUrl } = req.body;
  const createdBy = req.user?._id;
  try {
    const room = await roomService.createRoom(videoUrl, createdBy);
    res.status(201).json({ roomId: room.roomId });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const addVideoUrl = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const { videoUrl } = req.body;

  try {
    const room = await roomService.addVideoUrl(roomId, videoUrl);
    if (room) {
      res.status(200).json(room);
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getRoom = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  try {
    const room = await roomService.getRoomById(roomId);
    if (room) {
      res.status(200).json(room);
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteRoom = async (req: RequestExtended, res: Response) => {
  const { roomId } = req.params;
  try {
    const room = await roomService.deleteRoomById(roomId, req.user?._id);
    if (room) {
      res.status(200).json({ message: "Room deleted" });
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// delete particular video from room
// router.delete("/:roomId/:videoUrl", deleteRoom);
export const deleteVideo = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const videoUrl = req.body.videoUrl;
  try {
    const room = await roomService.deleteVideo(roomId, videoUrl);
    if (room) {
      res.status(200).json(room);
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
