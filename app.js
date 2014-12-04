var express = require('express');
var _ = require('underscore-node');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var wordDict = require("./wordDict.js").wordDict;
var tiles = require("./tiles.js");


app.engine(".html", require("ejs").renderFile);
app.set("views", __dirname + "/templates");
app.set('port', process.env.PORT || 3000);
app.use("/static", express.static(__dirname + "/static"));
app.use(express.urlencoded());
app.use(express.json());



var tileSet = function(tiles){
  var shuff_tiles = _.shuffle(tiles),
      letters = [],
      arrays = [],
      size = 5

  shuff_tiles.forEach(function(tile){
    var randNum = Math.floor(Math.random() * (5 - 0 + 1)) + 0; //random int from 0-5
    letters.push(tile[randNum] === "qu" ? "Qu" : tile[randNum].toUpperCase())
  })
  //makes array of 5 arrays
  while (letters.length > 0) {
    arrays.push(letters.splice(0, size));
  }
  return arrays
}



var playerOneWordList = []
var playerTwoWordList = []
var letters = tileSet(tiles);

app.get('/', function(req, res){
  res.render('choice.html');
});

app.get('/one_player', function(req, res) {
  tileSet(tiles);
  res.render("boggle.html", {locals:{ players : "onePlayer"}});
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


var clients = []

io.on('connection', function(socket){
  var userId = socket.id

  clients.push( {userId: socket.id, wordList: []})
  io.emit("user connected", userId, letters)
  console.log(userId)
  // clients[socket.id] = "connected";
  // console.log(socket.server.clients)
  // console.log(socket.nsp.server.eio.clients)
  // socket.on('chat message', function(msg){
  //   console.log('message: ' + msg);
  //   io.emit('chat message', msg);
  // });

  socket.on('submit word', function(user, word) {
    console.log("clients", clients)
    console.log("user: ", user, ", word: ", word);
  })
  socket.on("game over", function() {
    console.log("game over")
  })
  socket.on('disconnect', function(){

    for(var i=0; i<clients.len; i++) {
      if(clients[i].userId === socket.id){
        clients = _.without(clients, clients[i]);
      }
    }
    console.log('clients on disconnect', clients)
    console.log('user disconnected');
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







// var express = require("express");
// var app = express();
// var fs = require("fs");
// var path = require("path");
// var http = require("http").Server(app);
// var io = require("socket.io")(http);

// app.listen(3000, function() {
//   console.log("listening on port 3000");
// });
// app.set("view engine", "ejs");
// app.set("views", __dirname + "/templates");
// app.engine(".html", require("ejs").renderFile);
// app.use("/static", express.static(__dirname + "/static"));
// app.use(express.urlencoded());
// app.use(express.json());


// app.get("/", function(req, res) {
//   res.render("chat.html")
// })

// io.on('connection', function(socket){
//   console.log('a user connected');
// });



