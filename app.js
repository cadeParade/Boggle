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
  res.render('choice.html');
});

app.get("/test", function(req, res) {
  res.render("app.html");
})

app.post("/check_word", function(req, res) {
  var submission = req.param('word').toLowerCase();
  res.contentType('json');
  res.send({ isValidWord: wordDict[submission] === true });
})

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

  socket.on('start game for all room users', function(roomId) {
    var tiles = generateTiles();
    emitToRoom(roomId, 'start game', tiles);
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


  socket.on('disconnect', function(){
    console.log("disconnecting")
  });
});



http.listen(3000, function(){
  console.log('listening on *:3000');
});


