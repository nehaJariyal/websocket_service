const http = require('http');
require('dotenv').config();
const WebSocket = require('ws');
const { handleWebSocketConnection } = require('./handlers/websocketHandler');

const server = http.createServer();
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', handleWebSocketConnection);

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

const PORT = process.env.PORT;

server.listen(PORT, () => {
  logger.info(`WebSocket server is listening on port ${PORT}`);
});
