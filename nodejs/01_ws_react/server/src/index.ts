import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
const app: Application = express();
// リクエストボディのパース用設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// CORS
app.use(cors());
// ポート番号
const WebSocket_PORT = 8080;
// WebSocketサーバーの起動処理
const wss = new WebSocketServer({ port: WebSocket_PORT });
// WebSocket接続時の処理
wss.on("connection", (ws) => {
  console.log("WebSocket is connected.");
  ws.on("message", (message) => {
    // ブロードキャストでメッセージを送信
    wss.clients.forEach((client) => {
      client.send(`received message: ${message}`);
    });
  });
});
console.log("WebSocket server running at port: " + WebSocket_PORT);
