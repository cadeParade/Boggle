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

io.on('connection', function(socket){

  //get user id
  socket.on('request user id', function(fn) {
    console.log('requesting user id', socket.id);
    fn(socket.id)
  })

  // create room
  socket.on('create room', function(roomId) {
    socket.join(roomId);
    console.log("existing rooms when creating room = ", io.sockets.adapter.rooms)
    // emit make room 
  })

  // does room exist

  // join room
  socket.on("request room join", function(roomId, fn) {
    console.log("asking for room id: " + roomId);
    if(roomExists(roomId)) {
      socket.join(roomId);
      console.log("existing rooms when requesting join= ", io.sockets.adapter.rooms);
      console.log("keys?", Object.keys(io.sockets.adapter.rooms[roomId]));

      socket.to(roomId).emit("user joined room", Object.keys(io.sockets.adapter.rooms[roomId]))
      socket.emit("user joined room", Object.keys(io.sockets.adapter.rooms[roomId]))
      fn(true);
      //for each user in roomId
      // emit event to all sockets (users) in the room that another user joined the room
    }
    else {fn(false)}
  })


  var roomExists = function(roomId) {
    console.log("does this room exist?",io.sockets.adapter.rooms )
    return (roomId in io.sockets.adapter.rooms );
  }

  socket.on('submit word', function(user, word) {
    console.log("clients", clients)
    console.log("user: ", user, ", word: ", word);
  })
  socket.on("game over", function() {
    console.log("game over")
  })
  socket.on('disconnect', function(){
    console.log("disconnecting")
  });
});




http.listen(3000, function(){
  console.log('listening on *:3000');
  console.log("OMG OMG OMG");
});

// home page, option to play alone or with partner
// if alone, already done
// if with partner, move them to waiting page, give them code to go to same room with partner
// when other person connects, push them to game page
// shared view is board and timer, not selected letters or submitted words
// on timeup, score and display who won



