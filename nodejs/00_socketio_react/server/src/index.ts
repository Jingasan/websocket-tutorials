import express from "express";
import * as http from "http";
import * as socketio from "socket.io";

// WebSocketサーバーの設定
const HOST = "localhost";
const PORT = 5000;

// 初期化
const app: express.Express = express();
const server = http.createServer(app);
const io = new socketio.Server(server, {
  cors: {
    origin: "*", // クロスサイトの許容
    credentials: true,
  },
});

// WebSocketサーバーの起動
server.listen(PORT, HOST, () => {
  console.log("Running at localhost:" + PORT);
});

// WebSocket接続数
let connectionNum = 0;

// 接続確立時
io.on("connection", (socket) => {
  connectionNum++;
  console.log("connection(" + connectionNum + ")");

  // クライアントからのメッセージ受信時
  socket.on("sendMessage", (message: string) => {
    console.log("Message has been sent: ", message);
    // クライアントへのメッセージ送信
    io.emit("receiveMessage", message); // 全クライアントに対して受信したメッセージを送信する
  });

  // 接続終了時
  socket.on("disconnect", () => {
    connectionNum--;
    console.log("connection(" + connectionNum + ")");
  });
});
