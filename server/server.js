const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', function connection(ws, req) {
  ws.on('message', function incoming(data) {
    const {message, clientInfo: {languagePreference: language, id}} = JSON.parse(data);

    console.log('received: %s', message);

    broadcast(message);
  });
});

server.listen(8081, function listening() {
  console.log('Listening on %d', server.address().port);
});