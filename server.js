var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var bodyParser = require('body-parser');
var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

var port = process.env.PORT || 5000;

app.set('port', port);
app.use('/static', express.static(__dirname + '/static'));
// Routing
app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, '/static/index.html'));
});

server.listen(port, function () {
  console.log('Starting server on port ' + port);
});



var client = require('./client');
var dealer = require('./dealer.js');

var cardDealer = new dealer.Dealer();

var clients = [];
var turn = 0;

io.on('connection', function (socket) {
  socket.on('new player', function (nick) {

    setInterval(function () {
      io.sockets.emit('players-connected update', clients);
      io.sockets.emit('turn update');
    }, 1500)


    var newClient = new client.Client(socket.id, nick, cardDealer.randomStart(), false);

    clients.push(newClient);

    if (clients.length === 1) {
      clients[0].onTurn = true;
      io.sockets.connected[clients[0].socketID].emit('give turn');
    }

    io.sockets.connected[socket.id].emit('hand', getPlayerBySocketID(socket.id));
    io.sockets.emit('deck state', cardDealer.deck);
    io.sockets.emit('turn update');

    sendChatMessage("[Info] " + nick + " has joined the game");
    io.sockets.emit('players-connected update', clients);
  });

  socket.on('reset deck', function (socket) {
    cardDealer = new dealer.Dealer();
    io.sockets.emit('deck state', cardDealer.deck);

  })

  socket.on('shuffle', function (socket) {
    cardDealer.deck.shuffle();
    io.sockets.emit('deck state', cardDealer.deck);
  })

  socket.on('next turn', function (socket) {
    nextTurn();
  })

  socket.on('play', function (play) {
    handlePlay(play, getPlayerBySocketID(socket.id));
  })

  socket.on('send new message', function (message) {
    sendChatMessage("[" + getPlayerBySocketID(socket.id).nickname + "] " + message)
  })

  socket.on('disconnect', function () {
    var client = getPlayerBySocketID(socket.id);

    var clientIndex = clients.indexOf(client);

    if (client) {
      if (client.onTurn) {
        nextTurn();
      }
      sendInfoChatMessage(client.nickname + " has left the game");
    }
    clients.splice(clientIndex, 1);
  });
});

function handlePlay(play, player) {
  //refactor
  if (play === 'take one coin') {
    player.coins++;
    nextTurn();
    sendInfoChatMessage(player.nickname + " took 1 coin");
  }
  else if (play === 'take two coins') {
    clients.forEach(function (client) {
      if (client != player) {
        io.sockets.connected[client.socketID].emit('play intention', {
          play: play,
          player: player
        });
      }
    })
  }
}

function nextTurn() {
  clients[turn].onTurn = false;
  turn = (turn + 1) % clients.length;
  clients[turn].onTurn = true;

  var socket = io.sockets.connected[clients[turn].socketID];
  if (socket)
    socket.emit('give turn');

  io.sockets.emit('turn update');
}


function sendInfoChatMessage(message) {
  sendChatMessage("[Info] " + message);
}

function sendChatMessage(message) {
  io.sockets.emit('new message', message);
}


function getPlayerBySocketID(socketid) {
  return clients.filter(c => c.socketID === socketid)[0];
}


