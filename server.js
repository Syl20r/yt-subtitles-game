'use strict';
let http = require('http');
let express = require('express');
let socketio = require('socket.io');

var port = process.env.PORT || 8080;

// Application
let app = express();
let server = http.createServer(app);
let io = socketio(server);

var SOCKET_LIST = {}; // Liste des clients [id]
var PLAYER;

// Le navigateur web ouvre directement le dossier 'client' => index.html
app.use(express.static(__dirname + '/client'));
server.listen(port, () => console.log('Ecoute du port ' + port));

// Quand un client se connecte
io.on('connection', function(sock) {
  sock.on('player', function () {
    console.log("PLAYER connected");
    PLAYER = sock;
  });
  sock.on('id', function(dict) {
    // Ajoute les infos au client (sock)
    sock.id = dict.id;
    sock.username = dict.username;
    // Ajoute le client dans la liste des clients
    SOCKET_LIST[sock.id] = sock;
    console.log(sock.username + " connected");
  });

  sock.on('sub', function(sub) {
    sock.sub = sub;
    SOCKET_LIST[sock.id] = sock;
    if (toutLeMondeAValider()) {
      startVideo();
    }
  });
});

function toutLeMondeAValider() {
  for (var i in SOCKET_LIST) {
    if (SOCKET_LIST[i].sub === undefined) {
      return false;
    }
  }
  return true;
}

function startVideo() {
  for (var i in SOCKET_LIST) {
    var sub = SOCKET_LIST[i].sub;
      PLAYER.emit('play', sub);
    }
}
