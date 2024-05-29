import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import cors from "cors";
import { createServer } from "http"; // Import createServer from http
import { Server } from "socket.io"; // Import Server from socket.io

import roomRoutes from "./routes/roomRoutes";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
connectDB().catch((err) => {
  console.error(err.stack || err);
  process.exit(1);
});

app.use("/api/rooms", roomRoutes);

// listern
const PORT = process.env.PORT;

// Create HTTP server and integrate Socket.io
const httpServer = createServer(app); // Create an HTTP server using the Express app
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Adjust the origin as per your needs
    methods: ["GET", "POST"],
  },
});

// Socket.io setup
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
    // emit to all user except the sender
    socket.to(roomId).emit("play", time);
  });

  socket.on("pause", (roomId, time) => {
    console.log(`Pause event in room ${roomId} at time ${time}`);
    socket.to(roomId).emit("pause", time);
  });

  socket.on("seek", (roomId, time) => {
    console.log(`Seek event in room ${roomId} at time ${time}`);
    socket.to(roomId).emit("seek", time);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

// Start the HTTP server (which handles both Express and Socket.io)
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
