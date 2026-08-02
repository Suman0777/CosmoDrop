const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const rooms = new Map();

io.on("connection", (socket) => {
  console.log("[socket] connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    if (!rooms.has(roomId)) rooms.set(roomId, new Set());
    rooms.get(roomId).add(socket.id);
    socket.to(roomId).emit("user-joined");
    io.to(socket.id).emit("room-info", { count: rooms.get(roomId).size });
  });

  socket.on("file-meta", (data) => {
    socket.to(data.roomId).emit("file-meta", data);
  });

  socket.on("file-chunk", (data) => {
    socket.to(data.roomId).emit("file-chunk", data);
  });

  socket.on("transfer-complete", (roomId) => {
    socket.to(roomId).emit("transfer-complete");
  });

  socket.on("disconnecting", () => {
    for (const roomId of socket.rooms) {
      if (rooms.has(roomId)) {
        rooms.get(roomId).delete(socket.id);
        if (rooms.get(roomId).size === 0) rooms.delete(roomId);
        socket.to(roomId).emit("user-left");
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("[socket] disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`[socket] server running on port ${PORT}`);
});
