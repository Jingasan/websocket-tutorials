import React from "react";
import { io } from "socket.io-client";

// WebSocketサーバーの接続設定
const socket = io();

// Appコンポーネント
export default function App() {
  // DOM要素(<input>)への参照
  const messageRef = React.useRef<HTMLInputElement>(null);
  // 受信メッセージ一覧の配列
  const [receiveMessages, setReceiveMessages] = React.useState<string[]>([]);

  // サーバーからのメッセージを受信する関数
  socket.on("receiveMessage", (message) => {
    console.log(message);
    setReceiveMessages([...receiveMessages, message]);
    console.log(receiveMessages);
  });

  // 送信ボタンクリック時にメッセージをサーバーに送信する関数
  function sendMessage() {
    // Inputタグからのテキスト取得
    if (messageRef.current === null) return;
    const sendMessage = messageRef.current.value;
    // サーバーへのメッセージ送信
    if (!String(sendMessage).trim()) return;
    socket.emit("sendMessage", sendMessage);
    messageRef.current.value = "";
  }

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
