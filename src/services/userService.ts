// src/services/userService.ts
import User, { IUser } from "../models/userModel";
import Room from "../models/roomModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async (
  username: string,
  email: string,
  hashedPassword: string
): Promise<IUser> => {
  const user = new User({ username, email, password: hashedPassword });
  return await user.save();
};

export const getUserRooms = async (userId: string): Promise<IUser | null> => {
  return await User.findById(userId)
    .select("-password -username -email -_id")
    .populate("createdRooms joinedRooms invitations");
};

export const joinRoom = async (
  userId: string,
  roomId: string
): Promise<IUser | null> => {
  const user = await User.findById(userId);
  const room = await Room.findById(roomId);

  if (user && room) {
    user.joinedRooms.push(room._id);
    await user.save();
    return user;
  }

  return null;
};

export const inviteUser = async (
  userId: string,
  roomId: string
): Promise<IUser | null> => {
  const user = await User.findById(userId);
  const room = await Room.findById(roomId);

  if (user && room) {
    user.invitations.push(room._id);
    await user.save();
    return user;
  }

  return null;
};

export const getInvitations = async (userId: string): Promise<IUser | null> => {
  return await User.findById(userId).populate("invitations");
};
// create funtion for hashing password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
// finduserby email
export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email });
};
// compare password
export const comparePasswords = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
// create token
export const createToken = (user: IUser): string => {
  return jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY!, {
    expiresIn: "7d",
  });
};
// verify token
export const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY!);
};

// getUserById;
export const getUserById = async (userId: string): Promise<IUser> => {
  return await User.findById(userId).select("-password");
};
