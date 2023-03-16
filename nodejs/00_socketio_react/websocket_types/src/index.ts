// サーバーからクライアントへのメッセージ送信の型
export type ServerToClientType = {
  id: number;
  message: string;
};
export type ServerToClientEvents = {
  receiveMessage: (data: ServerToClientType) => void;
};

// クライアントからサーバーへのメッセージ送信の型
export type ClientToServerType = {
  id: number;
  message: string;
};
export type ClientToServerEvents = {
  sendMessage: (data: ClientToServerType) => void;
};
