// src/models/User.ts
import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdRooms: Types.ObjectId[]; // Array of room IDs
  joinedRooms: Types.ObjectId[]; // Array of room IDs
  invitations: Types.ObjectId[]; // Array of room IDs
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdRooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
    joinedRooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
    invitations: [{ type: Schema.Types.ObjectId, ref: "Room" }],
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);
export default User;
