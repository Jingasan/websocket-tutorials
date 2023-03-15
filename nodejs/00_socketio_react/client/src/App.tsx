import React from "react";
import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ClientToServerType,
  ServerToClientEvents,
  ServerToClientType,
} from "./model";

// WebSocketサーバーの接続設定
const HOST = "localhost";
const PORT = 3000;
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://" + HOST + ":" + PORT
);
let messageId = 0;

// Appコンポーネント
export default function App() {
  // DOM要素(<input>)への参照
  const messageRef = React.useRef<HTMLInputElement>(null);
  // 受信メッセージ一覧の配列
  const [receiveMessages, setReceiveMessages] = React.useState<string[]>([]);

  React.useEffect(() => {
    // WebSocket接続
    socket.connect();

    // WebSocketの接続開始時
    const onConnect = () => {
      console.log("WebSocket is connected.");
    };
    socket.on("connect", onConnect);

    // サーバーからのメッセージを受信時の処理を登録
    const onReceive = (data: ServerToClientType) => {
      const message = data.id.toString() + ": " + data.message;
      setReceiveMessages((previous) => [...previous, message]);
    };
    socket.on("receiveMessage", onReceive);

    // WebSocketの接続切断時
    const onDisconnect = () => {
      console.log("WebSocket is disconnected.");
    };
    socket.on("disconnect", onDisconnect);

    // Clean up
    return () => {
      console.log("Unmounted");
      // イベントリスナーの解除
      socket.off("receiveMessage", onReceive);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      // WebSocketの切断
      socket.disconnect();
    };
  }, []);

  // 送信ボタンクリック時にメッセージをサーバーに送信する関数
  const sendMessage = () => {
    // Inputタグからのテキスト取得
    if (messageRef.current === null) return;
    const sendMessage: ClientToServerType = {
      id: messageId++,
      message: messageRef.current.value,
    };
    // サーバーへのメッセージ送信
    if (!String(sendMessage).trim()) return;
    socket.emit("sendMessage", sendMessage);
    messageRef.current.value = "";
  };

  return (
    <div>
      {/* 送信メッセージの入力ボックス */}
      <input type="text" ref={messageRef} placeholder="write message" />
      <button onClick={sendMessage}>Send</button>
      {/* 受信メッセージの表示 */}
      {receiveMessages && (
        <div>
          {receiveMessages.map((message, index) => {
            return <li key={index}>{message}</li>;
          })}
        </div>
      )}
    </div>
  );
}
