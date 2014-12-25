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


var playerOneWordList = []
var playerTwoWordList = []
var letters = tiles();
var clients = []


app.get('/', function(req, res){
  res.render('app.html');
});

// handle user connections and actions
io.on('connection', function(socket){

  socket.on('request user id', function(fn) {
    fn(socket.id)
  })

  socket.on('create room', function(roomId, fn) {
    socket.join(roomId);
  })

  socket.on("request room join", function(roomId, fn) {
    if(roomExists(roomId)) {
      socket.join(roomId);
      emitToRoom(roomId, 'user joined room', Object.keys(io.sockets.adapter.rooms[roomId]))
      fn(true);
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
      socket.emit('update score', 1, fn)
    }
  })

  socket.on('update scoreboard', function(roomId, userId, score) {
    emitToRoom(roomId, 'display scoreboard', {userId: userId, score: score});
  })

  //helper functions
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


