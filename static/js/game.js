var $ = require('jquery');


var Game = function(socket) {
  this.socket = socket;
  this.localUserId = null;
  this.users = [];
  this.tiles = [];
  this.score = 0;
  this.userScores = {}
  // this.roomName -- assigned later
  // this.app -- assigned later

//from server
  var _this = this;
  this.socket.emit('request user id', function(id){
    _this.users.push(id);
    _this.userScores[id] = 0;
    _this.localUserId = id;
    _this.app.setState({game: _this})
  });

  this.socket.on('user joined room', function(roomUsers) {
    _this.users = roomUsers;
    _this.users.forEach(function(user) {
      _this.userScores[user] = 0;
    })
    _this.app.setState({game: _this, userScores: _this.userScores})
  });

// can these be combined?
  this.socket.on('start game one player', function(tiles) {
    _this.app.setState({view: "OnePlayer", tiles: tiles})
  });

  this.socket.on('start game multiplayer', function(tiles) {
    _this.app.setState({view: "MultiPlayer", tiles: tiles})
  });

  this.socket.on('update score', function(addToScore, fn) {
    _this.score = _this.score + addToScore;
    _this.socket.emit('update scoreboard', _this.roomName, _this.localUserId, _this.score)
    fn();
  })

  this.socket.on('display scoreboard', function(data) {
    _this.userScores[data["userId"]] = data["score"];
    _this.app.setState({userScores: _this.userScores})
  })

  // TODO:
  // show someone left room
  // game ended
  // someone played word
}


// from react

Game.prototype.createRoom = function() {
  // var roomName = Math.random().toString(36).substring(2,7);
  var roomName = "funlandia"
  this.roomName = roomName;
  this.socket.emit('create room', roomName);
};

Game.prototype.joinRoom = function(roomName) {
  var _this = this;
  this.socket.emit('request room join', roomName, function(success) {
    if (success) {
      _this.roomName = roomName;
      _this.app.setState({game: this, view: "WaitingRoom"})
    }
    else {
      console.log("you fail");
    }
  });
};

Game.prototype.startGameMulti = function() {
  this.socket.emit('start game for all room users', this.roomName)
};

Game.prototype.startGameSingle = function() {
  this.socket.emit('start game one player', this.roomName)
};

Game.prototype.checkWord = function(submission, fn) {
  $.post('/check_word', {word: submission}, fn);
};

Game.prototype.submitWord = function(submission, fn) {
  this.socket.emit('submit word', submission, fn)
};

// TODO:
// you played word


var io = require('socket.io-client');
module.exports = {Game: Game}




