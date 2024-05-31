// src/models/Room.ts
import { Schema, model, Document, Types } from "mongoose";

export interface IRoom extends Document {
  videoUrl: string[];
  roomId: string;
  createdBy?: Types.ObjectId; // User ID of the creator
  isPrivate: boolean; // Indicates if the room is private
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema = new Schema<IRoom>(
  {
    videoUrl: [{ type: String, required: true }],
    roomId: { type: String, required: true, unique: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    isPrivate: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Room = model<IRoom>("Room", roomSchema);
export default Room;
