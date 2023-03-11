import express, { Application, Request, Response, NextFunction } from "express";
import expressWs from "express-ws";
import { WebSocket, RawData } from "ws";
import cors from "cors";
const app: Application = express();
const expressWebSocket = expressWs(app);
// リクエストボディのパース用設定
expressWebSocket.app.use(express.json());
expressWebSocket.app.use(express.urlencoded({ extended: true }));
// CORS
expressWebSocket.app.use(cors());
const PORT = 8080;
let connects: WebSocket[] = [];
// WebSocket接続時の処理
expressWebSocket.app.ws(
  "/",
  (ws: WebSocket, _req: Request, _next: NextFunction) => {
    // 接続を確立したWebSocketを格納
    connects.push(ws);
    // メッセージ受信時の処理
    ws.on("message", (msg: RawData) => {
      // すべてのクライアントにメッセージをそのまま返す
      connects.forEach((socket: WebSocket) => {
        socket.send(msg);
      });
      console.log(msg);
    });
    // 接続切断時の処理
    ws.on("close", () => {
      connects = connects.filter((conn: WebSocket) => {
        return conn === ws ? false : true;
      });
    });
  }
);
// GETリクエストを受け取る関数: "/"にアクセスがあった場合にhtmlを返す
expressWebSocket.app.get(
  "/",
  (_req: Request, res: Response, _next: NextFunction) => {
    res.sendFile(__dirname + "/index.html");
  }
);
// サーバーを起動する処理
try {
  expressWebSocket.app.listen(PORT, () => {
    console.log("WebSocket server running at port: " + PORT);
  });
} catch (e) {
  if (e instanceof Error) {
    console.error(e.message);
  }
}
