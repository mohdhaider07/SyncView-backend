import Room, { IRoom } from "../models/roomModel";

export const createRoom = async (videoUrl: string): Promise<IRoom> => {
  const roomId = generateRoomId(); // Function to generate unique room ID
  console.log("roomId", roomId);
  console.log("videoUrl", videoUrl);
  const room = new Room({ videoUrl: [videoUrl], roomId });
  return await room.save();
};
// addVideoUrl add more youtube url to room
export const addVideoUrl = async (
  roomId: string,
  videoUrl: string
): Promise<IRoom | null> => {
  return await Room.findOneAndUpdate(
    { roomId },
    { $push: { videoUrl } },
    { new: true }
  );
};

export const getRoomById = async (roomId: string): Promise<IRoom | null> => {
  return await Room.findOne({ roomId });
};

const generateRoomId = (): string => {
  return Math.random().toString(36).slice(2, 12);
};
// roomService.deleteRoomById(roomId); create this funtion for deleting room
export const deleteRoomById = async (roomId: string) => {
  return await Room.findOneAndDelete({ roomId });
};
