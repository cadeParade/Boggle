var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var wordDict = require("./wordDict.js").wordDict;


app.engine(".html", require("ejs").renderFile);
app.set("views", __dirname + "/templates");
app.set('port', process.env.PORT || 3000);
app.use("/static", express.static(__dirname + "/static"));
app.use(express.urlencoded());
app.use(express.json());



app.get('/', function(req, res){
  res.render('choice.html');
});

app.get('/one_player', function(req, res) {
  res.render("boggle.html", {locals:{ players : "onePlayer"}});
})

app.post("/check_word", function(req, res) {
  var submission = req.param('word').toLowerCase();
  res.contentType('json');
  res.send({ isValidWord: wordDict[submission] === true });
})

app.get("/two_player", function(req, res) {
  res.render("boggle.html", {locals:{ players : "twoPlayer" }});
})



io.on('connection', function(socket){
  console.log('a user connected sss');
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
  socket.on('disconnect', function(){
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





