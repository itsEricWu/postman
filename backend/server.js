const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 3001;
const connectDB = require("./config/db");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const user = require("./controllers/users");
const { createServer } = require("http");
const { Server } = require("socket.io");
const Msg = require("./models/message");

const app = express();
const httpServer = createServer(app);
connectDB();
// socket.io
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    console.log("test" + data);
    socket.join("1");
  });
  socket.on("send_message", (msg) => {
    io.in("1").emit("receive_message", msg);
  });
  Msg.find().then((result) => {
    socket.emit("history_message", result);
  });
});
httpServer.listen(port, () => console.log(`Server running on port ${port}`));

app.use(
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "50mb",
    parameterLimit: 100000,
    extended: true,
  })
);
app.use(
  express.urlencoded({
    limit: "50mb",
    parameterLimit: 100000,
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", user.router);
