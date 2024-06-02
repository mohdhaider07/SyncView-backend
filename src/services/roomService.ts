// src/services/roomService.ts
import Room, { IRoom } from "../models/roomModel";
import User from "../models/userModel";
import { generateUniqueId, getPlaylistVideos } from "../utils/utils";

export const createRoom = async (
  videoUrl: string[],
  createdBy: string
): Promise<IRoom> => {
  const room = new Room({
    videoUrl,
    roomId: generateUniqueId(),
    createdBy,
  });
  await room.save();

  const user = await User.findById(createdBy);
  if (user) {
    user.createdRooms.push(room._id);
    await user.save();
  }

  return room;
};

export const addVideoUrl = async (
  roomId: string,
  videoUrl: string
): Promise<IRoom | null> => {
  const room = await Room.findOne({ roomId });
  // check user has created this room then he can add or if he is a part of this room
  if (room) {
    room.videoUrl.push(videoUrl);
    return await room.save();
  }
  return null;
};

export const getRoomById = async (roomId: string): Promise<IRoom | null> => {
  return await Room.findOne({ roomId }).populate("createdBy");
};

export const deleteRoomById = async (
  roomId: string,
  userId: string
): Promise<IRoom | null> => {
  const room = await Room.findOneAndDelete({ roomId, createdBy: userId });
  if (room) {
    const user = await User.findById(room.createdBy);
    if (user) {
      user.createdRooms = user.createdRooms.filter(
        (id) => !id.equals(room._id)
      );
      await user.save();
    }
  }
  return room;
};
/* // delete particular video from room
// router.delete("/:roomId/:videoUrl", deleteRoom);
export const deleteVideo = async (req: Request, res: Response) => {
  const { roomId, videoUrl } = req.params;
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
};*/
export const deleteVideo = async (
  roomId: string,
  videoUrl: string
): Promise<IRoom | null> => {
  const room = await Room.findOne({
    roomId,
    videoUrl: { $in: [videoUrl] },
  });
  if (room) {
    room.videoUrl = room.videoUrl.filter((url) => url !== videoUrl);
    return await room.save();
  }
  return null;
};

// addPlaylist
export const addPlaylist = async (
  roomId: string,
  playlistUrl: string
): Promise<IRoom | null> => {
  //
  const videoUrls = await getPlaylistVideos(playlistUrl);
  await Room.findByIdAndUpdate(roomId, {
    $addToSet: { videoUrl: { $each: videoUrls } },
  });
  return videoUrls;
};
