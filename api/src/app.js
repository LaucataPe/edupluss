const fs = require("fs");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { router } = require("./routes/index");
const cors = require("cors");
const { PORT } = require("./config/varEnv.js");
const verifyJWT = require("./Middlewares/verifyJWT");
const http = require("http");
const { resolve, dirname } = require("path");
const { Server: SocketServer } = require("socket.io");

const server = express();

server.set("port", PORT);
server.name = "API";

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));
server.use(cors());
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

server.use("/", router);

// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).json({ message });
});

const ioserver = http.createServer(server);
const io = new SocketServer(ioserver, {
  cors: {
    origin: "https://localhost:5173/",
    methods: ["GET", "POST"],
    credentials: true,
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert"),
  },
});
ioserver.listen(5173, () => {
  console.log("Server is running on port 8080");
});

server.use(express.urlencoded({ extended: false }));

io.on("connection", (socket) => {
  console.log(`El usuario ${socket.id} se ha conectado`);
  socket.on("message", (body) => {
    socket.broadcast.emit("message", {
      body,
      from: socket.id.slice(8),
    });
  });
});

module.exports = server;
