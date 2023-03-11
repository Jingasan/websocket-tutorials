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
const HTTP_PORT = 8000;
// WebSocket接続時の処理
const wss = new WebSocketServer({ port: WebSocket_PORT });
wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    // ブロードキャストでメッセージを送信
    wss.clients.forEach((client) => {
      client.send(`received message: ${message}`);
    });
  });
});
console.log("WebSocket server running at port: " + WebSocket_PORT);
// GETリクエストを受け取る関数: "/"にアクセスがあった場合にhtmlを返す
app.get("/", (_req: Request, res: Response, _next: NextFunction) => {
  res.sendFile(__dirname + "/index.html");
});
// サーバーを起動する処理
try {
  app.listen(HTTP_PORT, () => {
    console.log("HTTP Socket server running at port: " + HTTP_PORT);
  });
} catch (e) {
  if (e instanceof Error) {
    console.error(e.message);
  }
}
