// src/controllers/roomController.ts
import { Request, Response } from "express";
import * as roomService from "../services/roomService";

export const createRoom = async (req: Request, res: Response) => {
  const { videoUrl } = req.body;
  try {
    const room = await roomService.createRoom(videoUrl);
    res.status(201).json({ roomId: room.roomId });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
// addVideoUrl add more youtube url to room
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
    console.log(error);
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
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
// delete room
export const deleteRoom = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  try {
    const room = await roomService.deleteRoomById(roomId);
    if (room) {
      res.status(200).json(room);
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
