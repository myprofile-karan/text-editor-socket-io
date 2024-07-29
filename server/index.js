import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const PORT = 3001;
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Object to maintain users in each room
const rooms = {};

io.on("connection", (socket) => {
  // Listen for join-room event to track user count
  socket.on("join-room", ({ roomId, userName }) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }
    rooms[roomId].push(userName);

    // Emit the user count to the room
    io.to(roomId).emit("user-count", rooms[roomId].length);

    // Handle user disconnect
    socket.on("disconnect", () => {
      rooms[roomId] = rooms[roomId].filter((user) => user !== userName);
      io.to(roomId).emit("user-count", rooms[roomId].length);
    });

    // Handle document editing events
    socket.on("get-document", (id) => {
      const data = "";
      socket.join(id);
      socket.emit("load-document", data);

      socket.on("send-changes", (delta) => {
        socket.broadcast.to(id).emit("receive-changes", delta);
      });

      socket.on("send-message", (message) => {
        io.to(id).emit("receive-message", message);
      });
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});