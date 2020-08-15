const webSocketServer = require('websocket').server;
const http = require('http');
const uuid = require('uuid');

const port = 8000;
const server = http.createServer();
server.listen(port);
console.log('webSocket start at port: ' + port);

const wsServer = new webSocketServer({
  httpServer: server,
});

const clients = {};

// This code generates unique userid for everyuser.
const getUniqueID = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return s4() + s4() + '-' + s4();
};

wsServer.on('request', function (request) {
  // var userID = getUniqueID();
  var userID = uuid.v5();
  console.log(new Date() + ' Recieved a new connection from origin ' + request.origin + '.');

  // You can rewrite this part of the code to accept only the requests from allowed origin
  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients));

  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      console.log('Received Message: ', message.utf8Data);

      // broadcasting message to all connected clients
      for (key in clients) {
        clients[key].sendUTF(message.utf8Data);
        console.log('sent Message to: ', clients[key]);
      }
    }
  });
});