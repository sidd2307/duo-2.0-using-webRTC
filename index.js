const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "https://duoBySid.netlify.app",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // my id
  socket.emit("me", socket.id);

  //disconnected
  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  //call user
  socket.on("callUser", (data) => {
    //to means the person whom we want to call
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  //answering the call
  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log("Server is running on port 5000"));
