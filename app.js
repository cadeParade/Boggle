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

app.get('/one_player', function(req, res) {
  res.render("boggle.html", {locals:{ players : "onePlayer"}});
})

app.get('/join_multiplayer', function(req, res) {
  res.render("join_multiplayer.html")
})

app.get("/waiting_room", function(req, res) {
  console.log("WAITING ROOM")
  res.render("waiting.html")
})

app.post("/check_word", function(req, res) {
  var submission = req.param('word').toLowerCase();
  res.contentType('json');
  res.send({ isValidWord: wordDict[submission] === true });
})

// app.get("/two_player", function(req, res) {
//   res.render("boggle.html", {locals:{ players : "twoPlayer" }});
// })
app.get("/two_player", function(req, res) {
  res.render("waiting.html");
})

// var clients = {playerOne: {id: "none", wordList: []},
//                playerTwo: {id: "none", wordList: []}};



io.on('connection', function(socket){
  var userId = socket.id

  io.emit("user connected", userId, letters)

  socket.on('join room', function(roomId) {
    socket.join(roomId);
    io.emit("go to waiting room");

  })

  socket.on("request room join", function(roomId) {
    // console.log(socket.id, "requesting to join", roomId);
    // console.log("existing rooms = ", io.sockets.adapter.rooms)
    if( roomId in io.sockets.adapter.rooms ) {
      socket.join(roomId)
      io.emit("joined room", roomId)
    }
    else {
      io.emit("room does not exist", roomId)
    }
  })

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



