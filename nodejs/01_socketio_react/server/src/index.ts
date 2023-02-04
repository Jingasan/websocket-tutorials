import express from "express";
import * as http from "http";
import * as socketio from "socket.io";

// 初期化
const app: express.Express = express();
const server = http.createServer(app);
const io = new socketio.Server(server, {
  cors: {
    origin: "http://localhost:3000", // クロスサイトの許容
    credentials: true,
  },
});

// WebSocketサーバーの設定
const HOST = "localhost";
const PORT = 5000;
// WebSocketサーバーの起動
server.listen(PORT, HOST, () => {
  console.log("Running at localhost:" + PORT);
});

// コネクション確立時
io.on("connection", (socket) => {
  // クライアントとのコネクションが確立したら以下を表示
  console.log("user connected");

  // クライアントからのメッセージ受信
  socket.on("sendMessage", (message: string) => {
    console.log("Message has been sent: ", message);
    // クライアントへのメッセージ送信
    io.emit("receiveMessage", message); // 全クライアントに対して受信したメッセージを送信する
  });
});
