var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.engine(".html", require("ejs").renderFile);
app.set("views", __dirname + "/templates");
app.set('port', process.env.PORT || 3000);
app.use("/static", express.static(__dirname + "/static"));

app.get('/', function(req, res){
  res.render('choice.html');
});


io.on('connection', function(socket){
  console.log('a user connected');
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
// var wordDict = require("./wordDict.js").wordDict;
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




// app.post("/check_word", function(request, response) {
//   var submission = request.param('word').toLowerCase();
//   response.contentType('json');
//   response.send({ isValidWord: wordDict[submission] === true });
// })


