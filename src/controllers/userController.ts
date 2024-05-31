// src/controllers/userController.ts
import { Request, Response } from "express";
import * as userService from "../services/userService";
import * as roomService from "../services/roomService";

export const createUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  // hash the password
  const hashedPassword = await userService.hashPassword(password);
  try {
    const user = await userService.createUser(username, email, hashedPassword);
    res.status(201).json({ message: "User created" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
// login function
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await userService.comparePasswords(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // send jwt token
    const token = userService.createToken(user);
    // send everything but not password of the user
    user.password = "";
    res.status(200).json({ token, user });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserRooms = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const rooms = await userService.getUserRooms(userId);
    res.status(200).json(rooms);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const joinRoom = async (req: Request, res: Response) => {
  const { userId, roomId } = req.params;
  try {
    const room = await userService.joinRoom(userId, roomId);
    res.status(200).json(room);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const inviteUser = async (req: Request, res: Response) => {
  const { userId, roomId } = req.params;
  try {
    const invitation = await userService.inviteUser(userId, roomId);
    res.status(200).json(invitation);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getInvitations = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const invitations = await userService.getInvitations(userId);
    res.status(200).json(invitations);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
