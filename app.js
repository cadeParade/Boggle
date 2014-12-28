var express = require('express');
var _ = require('underscore-node');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var wordDict = require("./wordDict.js").wordDict;
var tiles = require("./static/js/tiles.js");


app.engine(".html", require("ejs").renderFile);
app.set("views", __dirname + "/templates");
app.set('port', process.env.PORT || 3000);
app.use("/static", express.static(__dirname + "/static"));
app.use(express.urlencoded());
app.use(express.json());


var rooms = {}


app.get('/', function(req, res){
  res.render('app.html');
});

// handle user connections and actions
io.on('connection', function(socket){

  socket.on('request user id', function(fn) {
    fn(socket.id)
  })

  socket.on('create room', function(data, fn) {
    rooms[data.roomId] = {};
    addPlayerToRoom(data.roomId, data.playerName)
    socket.join(data.roomId);
    console.log('created room', data.roomId)
    console.log(rooms[data.roomId])
    fn(rooms[data.roomId])
  })

  socket.on("request room join", function(data, fn) {
    if(roomExists(data.roomId)) {
      socket.join(data.roomId);
      addPlayerToRoom(data.roomId, data.playerName);
      emitToRoom(data.roomId, 'user joined room', rooms[data.roomId])
      fn(true, rooms[data.roomId]);
    }
    else {fn(false)}
  })

  // can these be combined?
  socket.on('start game for all room users', function(roomId) {
    emitToRoom(roomId, 'start game multiplayer', generateTiles());
  })
  socket.on('start game one player', function(roomId) {
    socket.emit('start game one player', generateTiles());
  })

  socket.on('submit word', function(submission, fn) {
    if(isValidWord(submission)) {
      socket.emit('update score', submission, fn)
    }
  })

  socket.on('update scoreboard', function(roomId, userId, score) {
    emitToRoom(roomId, 'display scoreboard', {userId: userId, score: score});
  })

  //helper functions

  var addPlayerToRoom = function(roomId, playerName) {
    rooms[roomId][socket.id] = {score: 0, playerName: playerName};
  }
  var emitToRoom = function(roomId, action, data) {
    socket.to(roomId).emit(action, data);
    socket.emit(action, data);
  }

  var roomExists = function(roomId) {
    return (roomId in io.sockets.adapter.rooms );
  }

  var generateTiles = function() {
    return(tiles());
  }

  var isValidWord = function(submission) {
    return(wordDict[submission.toLowerCase()]);
  }



  socket.on('disconnect', function(){
    console.log("disconnecting")
  });
});



http.listen(3000, function(){
  console.log('listening on *:3000');
});


