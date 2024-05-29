import { Schema, model, Document } from "mongoose";

export interface IRoom extends Document {
  videoUrl: string[];
  roomId: string;
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema = new Schema<IRoom>(
  {
    videoUrl: [{ type: String, required: true }],
    roomId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Room = model<IRoom>("Room", roomSchema);
export default Room;
