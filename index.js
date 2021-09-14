const path = require("path");
const http = require("http");
const express = require("express");
const cors = require("cors");
const socketio = require("socket.io");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config(); // load env variables
const app = express();
app.use(express.json());
app.use(cors());
const router = express.Router();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

// Route to emit any information / efinanci requests
app.get("/", (req, res) => {
  res.send({ health: "Websockets server up and running" });
});
app.post("/emit", (req, res) => {
  //console.log(JSON.stringify(req.body));
  const { all_requests, new_request } = req.body;
  if (all_requests) {
    io.emit("all_requests", { all_requests: all_requests });
  }

  if (new_request) {
    io.emit("new_request", { new_request: new_request });
  }

  res.status(200).send({ status: true, success: true });
});

// Run when client connects
io.on("connection", (socket) => {
  socket.emit("connected", "Connected to websocket server.");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
