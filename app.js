var express = require("express");
var app = express();
var fs = require("fs");
var path = require("path");
var wordDict = require("./wordDict.js").wordDict;

app.listen(3000);
app.set("view engine", "ejs");
app.set("views", __dirname + "/templates");
app.engine(".html", require("ejs").renderFile);
app.use("/static", express.static(__dirname + "/static"));
app.use(express.urlencoded());
app.use(express.json());


app.get("/", function(request, response) {
  response.render("boggle.html")
})

app.post("/check_word", function(request, response) {
  var submission = request.param('word').toLowerCase();
  response.contentType('json');
  response.send({ isValidWord: wordDict[submission] === true });
})

