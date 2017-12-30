'use strict';
let http = require('http');
let express = require('express');
let socketio = require('socket.io');
var fs = require("fs");

var port = process.env.PORT || 8080;
var videoFile = "videos.json";
var contents = fs.readFileSync(videoFile);
var VIDEOS = JSON.parse(contents);

// Application
let app = express();
let server = http.createServer(app);
let io = socketio(server);

var SOCKET_LIST = {}; // Liste des clients [id]
var PLAYER;
var VOTES = [];

// Le navigateur web ouvre directement le dossier 'client' => index.html
app.use(express.static(__dirname + '/client'));
server.listen(port, () => console.log('Ecoute du port ' + port));

// Quand un client se connecte
io.on('connection', function(sock) {
  sock.on('player', function() {
    console.log("PLAYER connected");
    PLAYER = sock;

    sock.on('playVideo', function() {
      var r = Math.floor((Math.random() * VIDEOS.length));
      var video = VIDEOS[r];
      sock.emit('playVideo', video);
    });
    sock.on('startVote', function() {
      console.log('Vote started !');
      var propositions = [];
      for (var i in SOCKET_LIST) {
        propositions.push({'id': SOCKET_LIST[i].id, 'sub': SOCKET_LIST[i].sub});
      }
      io.emit('startVote', propositions);
    });
  });
  sock.on('id', function(dict) {
    // Ajoute les infos au client (sock)
    sock.id = dict.id;
    sock.username = dict.username;
    sock.points = 0;
    sock.vote;
    // Ajoute le client dans la liste des clients
    SOCKET_LIST[sock.id] = sock;
    console.log(sock.username + " connected");
  });
  sock.on('sub', function(sub) {
    sock.sub = sub;
    SOCKET_LIST[sock.id] = sock;
    if (toutLeMondeAValider('sub')) {
      startVideo();
    }
  });
  sock.on('addVideo', function(videoJson) {
    VIDEOS.push(videoJson);
    fs.writeFileSync(videoFile, JSON.stringify(VIDEOS), 'utf8');
  });
  sock.on('vote', function(id) {
    VOTES.push(id);
    SOCKET_LIST[sock.id].vote = true;
    if (toutLeMondeAValider('vote')) {
      var res = [];
      for (var i in VOTES) { // Addition les points
        SOCKET_LIST[VOTES[i]].points += 1;
      }
      for (var i in SOCKET_LIST) {
        var x = SOCKET_LIST[i];
        res.push({'username': x.username,
                  'points': x.points,
                  'sub': x.sub});
      }
      io.emit('voteResult', res);
      VOTES = [];
    }
  });
});



function toutLeMondeAValider(x) {
  if (x == 'sub') {
    for (var i in SOCKET_LIST) {
      if (SOCKET_LIST[i].sub === undefined) {
        return false;
      }
    }
  } else {
    for (var i in SOCKET_LIST) {
      if (SOCKET_LIST[i].vote === undefined) {
        return false;
      }
    }
  }
  return true;
}

function startVideo() {
  var subs = [];
  for (var i in SOCKET_LIST) {
    subs.push(SOCKET_LIST[i].sub);
  }
  PLAYER.emit('play', subs);
}
