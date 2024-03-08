const server = require("./src/app");
const { conn } = require("./src/db");
const morgan = require("morgan");
const cors = require("cors");
const PORT = 3005;
const httpServer = require("http").createServer();

conn.sync({ force: false }).then(() => {
  console.log("Database connected, master");
  const io = require("socket.io")(httpServer, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  // Middlewares
  server.use(cors());
  server.use(morgan("dev"));
  io.on("connection", (socket) => {
    console.log(`El usuario ${socket.id} se ha conectado`);
    socket.on("message", (body) => {
      socket.broadcast.emit("message", {
        body,
        from: socket.id.slice(8),
      });
    });
  });

  httpServer.listen(PORT); // Conflicto con
  console.log(`server on port ${PORT}`);
  server.listen(3001, () => {
    // Esto
    console.log("Server on port: 3001");
  });
});
