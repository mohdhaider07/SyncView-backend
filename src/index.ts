import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import cors from "cors";
import { createServer } from "http"; // Import createServer from http
import { Server } from "socket.io"; // Import Server from socket.io
import morgan from "morgan";

import roomRoutes from "./routes/roomRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

connectDB().catch((err) => {
  console.error(err.stack || err);
  process.exit(1);
});

app.use("/api/room", roomRoutes);
app.use("/api/user", userRoutes);

// listern
const PORT = process.env.PORT;

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
  console.log("A user connected", socket.id);

  socket.on("joinRoom", (roomId) => {
    console.log("join room");
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("play", (roomId, time) => {
    console.log(`Play event in room ${roomId} at time ${time}`);
    // Emit to all users in the room except the sender
    socket.broadcast.to(roomId).emit("play", time);
  });

  socket.on("pause", (roomId, time) => {
    console.log(`Pause event in room ${roomId} at time ${time}`);
    socket.broadcast.to(roomId).emit("pause", time);
  });

  //   socket.on("seek", (roomId, time) => {
  //     console.log(`Seek event in room ${roomId} at time ${time}`);
  //     socket.broadcast.to(roomId).emit("seek", time);
  //   });

  // changeVideo it will     socket.emit("changeVideo", roomId, selectedVideo);
  socket.on("changeVideo", (roomId, selectedVideo) => {
    console.log(
      `Change video event in room ${roomId} to video ${selectedVideo}`
    );
    socket.broadcast.to(roomId).emit("changeVideo", selectedVideo);
  });
  socket.on("newUrlAdded", (roomId, newUrl) => {
    console.log(`newUrlAdded event in room ${roomId} to url ${newUrl}`);
    socket.broadcast.to(roomId).emit("newUrlAdded", newUrl);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

// Start the HTTP server (which handles both Express and Socket.io)
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
