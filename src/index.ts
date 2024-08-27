import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import cors from "cors";
import { createServer } from "http"; // Import createServer from http
import { Server } from "socket.io"; // Import Server from socket.io
import morgan from "morgan";

import roomRoutes from "./routes/roomRoutes";
import userRoutes from "./routes/userRoutes";

import { RoomManager } from "./store/appState";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const roomManager = RoomManager.getInstance();

connectDB().catch((err) => {
  console.error(err.stack || err);
  process.exit(1);
});

app.use("/api/room", roomRoutes);
app.use("/api/user", userRoutes);

// listern
const PORT = process.env.PORT || 5000;

// Create HTTP server and integrate Socket.io
const httpServer = createServer(app); // Create an HTTP server using the Express app

const io = new Server(httpServer, {
  cors: {
    origin: ["https://sync-view.vercel.app/", "http://localhost:5173"], // Adjust the origin as per your needs
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("====================================");
  // console.log("A user connected", socket.id);

  console.log(roomManager.getRoomData());

  socket.on("joinRoom", ({ roomId, isRoomCreator }) => {
    socket.join(roomId);
    console.log("connected room id ", roomId);

    roomManager.addUserToRoom(roomId, socket.id, isRoomCreator);
    // console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("play", (roomId, time) => {
    // console.log(`Play event in room ${roomId} at time ${time}`);
    // Emit to all users in the room except the sender
    let canControl = true;
    canControl = roomManager.isUserAdmin(roomId, socket.id);
    if (!canControl) {
      canControl = roomManager.canControlRoom(roomId);
    }
    if (canControl) socket.broadcast.to(roomId).emit("play", time);
  });

  socket.on("pause", (roomId, time) => {
    // console.log(`Pause event in room ${roomId} at time ${time}`);
    let canControl = true;
    canControl = roomManager.isUserAdmin(roomId, socket.id);
    if (!canControl) {
      canControl = roomManager.canControlRoom(roomId);
    }
    if (canControl) {
      socket.broadcast.to(roomId).emit("pause", time);
    }
  });

  socket.on("changeVideo", (roomId, selectedVideo) => {
    // console.log(
    //   `Change video event in room ${roomId} to video ${selectedVideo}`
    // );

    let canControl = true;
    canControl = roomManager.isUserAdmin(roomId, socket.id);
    if (!canControl) {
      canControl = roomManager.canControlRoom(roomId);
    }
    if (canControl)
      socket.broadcast.to(roomId).emit("changeVideo", selectedVideo);
  });
  socket.on("newUrlAdded", (roomId, newUrl) => {
    // console.log(`newUrlAdded event in room ${roomId} to url ${newUrl}`);

    socket.broadcast.to(roomId).emit("newUrlAdded", newUrl);
  });

  socket.on("urlRemoved", (roomId, urlRemoved) => {
    // console.log(`urlRemoved event in room ${roomId} to url ${urlRemoved}`);

    socket.broadcast.to(roomId).emit("urlRemoved", urlRemoved);
  });

  socket.on("toggleControl", (roomId, controlState) => {
    // console.log(
    // `toggleControl event in room ${roomId} to state ${controlState}`
    // );

    console.log("control value form frone t", controlState);

    console.log("control before ", roomManager.canControlRoom(roomId));

    const isAdmin = roomManager.isUserAdmin(roomId, socket.id);
    if (isAdmin) {
      roomManager.setRoomControl(roomId, controlState);
      // socket.to(roomId).emit("toggleControl", controlState);
    }
    console.log("control after", roomManager.canControlRoom(roomId));
  });

  socket.on("leaveRoom", (roomId) => {
    // console.log(" disconnected room id ", roomId);
    roomManager.removeUserFromRoom(roomId, socket.id);
    // console.log(roomManager.getUsersInRoom(roomId));
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

// Start the HTTP server (which handles both Express and Socket.io)
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
