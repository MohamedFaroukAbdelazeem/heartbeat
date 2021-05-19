let setWsHeartbeat = require("ws-heartbeat/server");
let WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8000 });

let pingTimeout = 5 * 1000; // in 5 seconds, if no message accepted from client, close the connection
let pingMessage = '{"kind":"ping"}';
let pongMessage = '{"kind":"pong"}';

setWsHeartbeat.setWsHeartbeat(
  wss,
  (ws, data, binary) => {
    console.log(data);
    if (data === pingMessage) {
      ws.send(pongMessage);
    }
  },
  pingTimeout
);
