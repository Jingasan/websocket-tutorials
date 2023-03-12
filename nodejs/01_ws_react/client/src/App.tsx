import React from "react";
// WebSocketサーバーとの通信が途切れた際に再接続を試みるライブラリ
import ReconnectingWebSocket from "reconnecting-websocket";

// Appコンポーネント
export default function App() {
  // DOM要素(<input>)への参照
  const messageRef = React.useRef<HTMLInputElement>(null);
  // 受信メッセージ一覧の配列
  const [receiveMessages, setReceiveMessages] = React.useState<string[]>([]);
  // WebSocket
  const socketRef = React.useRef<ReconnectingWebSocket>();

  // WebSocket関連の処理は副作用のため、useEffect内で実装
  React.useEffect(() => {
    // WebSocketサーバーとの接続を確立
    const websocket = new ReconnectingWebSocket("ws://localhost:8080");
    socketRef.current = websocket;

    // WebSocketのメッセージ受信時のイベントハンドラを定義
    const onMessage = (event: MessageEvent<string>) => {
      setReceiveMessages((receiveMessages) => [...receiveMessages, event.data]);
      console.log(event.data);
    };
    websocket.addEventListener("message", onMessage);

    // WebSocketの通信確立時のイベントハンドラを定義
    const onOpen = () => {
      console.log("WebSocket is connected.");
    };
    websocket.addEventListener("open", onOpen);

    // WebSocketの通信終了時のイベントハンドラを定義
    const onError = () => {
      console.log("WebSocket connection error occurs.");
    };
    websocket.addEventListener("error", onError);

    // WebSocketの通信終了時のイベントハンドラを定義
    const onClose = () => {
      console.log("WebSocket connection is closed.");
    };
    websocket.addEventListener("close", onClose);

    console.log("Ititialized");
    // useEffectのクリーンアップ処理の中で、WebSocketの通信終了処理を実行
    return () => {
      websocket.close();
      websocket.removeEventListener("message", onMessage);
      websocket.removeEventListener("open", onOpen);
      websocket.removeEventListener("close", onClose);
      websocket.removeEventListener("error", onError);
      console.log("Unmounted");
    };
  }, []);

  // 送信ボタンクリック時にメッセージをサーバーに送信する関数
  function sendMessage() {
    // Inputタグからのテキスト取得
    if (messageRef.current === null) return;
    const sendMessage = messageRef.current.value;
    // サーバーへのメッセージ送信
    if (!String(sendMessage).trim()) return;
    socketRef.current?.send(sendMessage);
    messageRef.current.value = "";
  }

  // チャット画面
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
