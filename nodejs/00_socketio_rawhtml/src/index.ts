import express, { Request, Response } from "express";
import * as http from "http";
import * as socketio from "socket.io";

// 初期化
const app: express.Express = express();
const server = http.createServer(app);
const io = new socketio.Server(server);
const PORT = 3000;

// GETリクエストを受け取る関数: "/"にアクセスがあった場合にhtmlを返す
app.get("/", (_req: Request, res: Response) => {
  res.sendFile(__dirname + "/index.html");
});

// サーバーを起動する処理
server.listen(PORT, () => {
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
