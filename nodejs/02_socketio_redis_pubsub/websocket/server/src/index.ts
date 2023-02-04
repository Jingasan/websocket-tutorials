import express from "express";
import * as http from "http";
import * as socketio from "socket.io";
import * as IORedis from "ioredis";

// WebSocketサーバーの初期化
const app: express.Express = express();
const server = http.createServer(app);
const io = new socketio.Server(server);
const PORT = 3000;
// Redis Pub/Sub接続の初期化
const publisher = new IORedis.Redis("redis-server"); // ホスト名はRedisコンテナ名
const subscriber = new IORedis.Redis("redis-server"); // ホスト名はRedisコンテナ名
const pubsubChannelName = "channel";

// 静的ファイルを返す処理
app.use(express.static("public"));

// サーバーを起動する処理
server.listen(PORT, () => {
  console.log("Running at :" + PORT);
});

// RedisのSubscribe Channelの登録
subscriber.subscribe(pubsubChannelName);
// RedisからのメッセージSubscribe時
subscriber.on("message", (channel: string, message: string) => {
  // Redisからメッセージを受信したら以下を表示
  console.log("Received " + message + " from " + channel);
  // 本WebSocketサーバーに接続中の全クライアントに対して受信したメッセージを送信する
  io.emit("receiveMessage", message);
});

// クライアントとのコネクション確立時
io.on("connection", (socket) => {
  // クライアントとのコネクションが確立したら以下を表示
  console.log("Client is connected.");
  // クライアントからのメッセージ受信時
  socket.on("sendMessage", (message: string) => {
    // クライアントとのコネクションを受信したら以下を表示
    console.log("Message has been sent: ", message);
    // RedisへのメッセージのPublish
    publisher.publish(pubsubChannelName, message);
  });
});
