##### Build environment #####
FROM node:16.19-alpine as builder

# 依存パッケージのインストール
RUN apk update && \
    apk add mysql-client

# WebSocketサーバーのビルド
COPY server /server
WORKDIR /server
RUN npm install
RUN npm run build

# Reactフロントエンドのビルド
COPY client /client
WORKDIR /client
RUN npm install
RUN npm run build
RUN cp -r build /server/public


##### Production environment #####
FROM node:16.19-alpine as releaser

# 依存パッケージのインストール
RUN apk update && \
    apk add mysql-client

# WebSocketサーバーのインストール
COPY --from=builder /server /server
CMD ["npm", "start"]