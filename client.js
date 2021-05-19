let setWsHeartbeat = require("ws-heartbeat/client");
let WebSocket = require("ws");

let socketAlive = null;
let pingMessage = '{"kind":"ping"}';
let socketTimeout = 5 * 1000;
let port = 8000;

function connect() {
  const ws = new WebSocket(`ws://localhost:${port}`);
  return new Promise((resolve) => {
    console.log("connecting...");
    ws.on("open", () => {
      setWsHeartbeat.setWsHeartbeat(ws, pingMessage, {
        pingTimeout: 5 * 1000, // in 5 seconds, if no message accepted from server, close the connection.
        pingInterval: 1 * 1000, // every 1 seconds, send a ping message to the server.
      });

      console.log(`client connected to websocket server`);
      socketAlive = true;
      resolve(socketAlive);
    });

    ws.on("message", (data) => {
      console.log(data);
    });

    ws.on("close", (code, reason) => {
      reason = reason || "unknown";
      console.log(`SOCKET_CLOSED: code ${code}, reason ${reason}`);
      socketAlive = false;
    });

    ws.on("error", (err) => {
      console.log(`SOCKET_ERROR: `, new Error(err.message));
      socketAlive = false;
    });
  });
}

async function reconnect() {
  try {
    await connect();
  } catch (err) {
    logger.error("SOCKET_RECONNECT: Error", new Error(err.message));
  }
}

reconnect();

// repeat every 5 seconds
setInterval(() => {
  if (socketAlive == false) {
    reconnect();
  }
}, socketTimeout);
