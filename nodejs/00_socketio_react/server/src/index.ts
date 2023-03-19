import express from "express";
import * as http from "http";
import * as socketio from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@jingasan/websocket_types";

// WebSocketサーバーの設定
const PORT = 3000;

// 初期化
const app: express.Express = express();
const server = http.createServer(app);
const io = new socketio.Server<ClientToServerEvents, ServerToClientEvents>(
  server,
  {
    cors: {
      origin: "*", // クロスサイトの許容
      credentials: true,
    },
  }
);

// WebSocket接続数
let connectionNum = 0;

// HTTPサーバーの起動
server.listen(PORT, () => {
  console.log("Server running at localhost:" + PORT);
  console.log("connection num: " + connectionNum);
});

// 接続確立時
io.on("connection", (socket) => {
  connectionNum++;
  console.log("connection num: " + connectionNum);

  // クライアントからのメッセージ受信時
  socket.on("sendMessage", (data) => {
    console.log("Receive message: ", data.message);
    // 全クライアントに対して受信したメッセージを送信
    io.emit("receiveMessage", data);
  });

  // 接続終了時
  socket.on("disconnect", () => {
    connectionNum--;
    console.log("connection num: " + connectionNum);
  });
});
