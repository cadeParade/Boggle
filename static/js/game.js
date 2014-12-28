var $ = require('jquery');


var Game = function(socket) {
  this.socket = socket;
  this.localUserId = null;
  // this.users = [];
  this.tiles = [];
  this.score = 0;
  this.room = {} // {socketId: {playerName: "tom", wordList: {word: true, word2: true}, score: 5}}
  // this.roomName -- assigned later
  // this.app -- assigned later

//from server
  var _this = this;
  this.socket.emit('request user id', function(id){
    _this.localUserId = id;
    _this.app.setState({game: _this})
  });

  this.socket.on('user joined room', function(room) {
    _this.room = room;
    _this.app.setState({game: _this, userScores: _this.room})
  });

// can these be combined?
  this.socket.on('start game one player', function(tiles) {
    _this.app.setState({view: "OnePlayer", tiles: tiles})
  });

  this.socket.on('start game multiplayer', function(tiles) {
    _this.app.setState({view: "MultiPlayer", tiles: tiles})
  });

  this.socket.on('update score', function(word, fn) {
    _this.score = _this.score + _this.scoreWord(word)
    _this.socket.emit('update scoreboard', _this.roomName, _this.localUserId, _this.score)
    fn();
  })

  this.socket.on('display scoreboard', function(data) {
    _this.room[data["userId"]].score = data["score"];
    _this.app.setState({userScores: _this.room})
  })

  // TODO:
  // show someone left room
  // game ended
  // someone played word
}


// from react

Game.prototype.createRoom = function(playerName, fn) {
  // var roomName = Math.random().toString(36).substring(2,7);
  var _this = this;
  var roomName = "funlandia"
  this.roomName = roomName;
  this.socket.emit('create room', {roomId: roomName, playerName: playerName}, function(updatedRoom) {
    _this.room = updatedRoom;
    fn(_this.room);
  });
};

Game.prototype.joinRoom = function(roomId, playerName) {
  var _this = this;
  this.socket.emit('request room join', {roomId: roomId, playerName: playerName}, function(success, updatedRoom) {
    if (success) {
      _this.roomId = roomId;
      _this.room = updatedRoom;
      _this.app.setState({game: this, view: "WaitingRoom"})
    }
    else {
      console.log("you fail");
    }
  });
};

Game.prototype.setPlayerName = function(playerName) {
  var _this = this;
  this.createRoom(playerName, function(updatedRoom) {
    _this.room = updatedRoom;
    _this.app.setState({userScores: _this.room, view:"WaitingRoom"});
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

Game.prototype.scoreWord = function(word) {
    var wordScore = 0;
    var wordLength = word.length;
    if(wordLength >= 3) {
      wordScore = 1;
      if(wordLength > 4) {
        wordScore = wordScore + (wordLength - 4);
      }
    }
    return wordScore;
};

// TODO:
// you played word


var io = require('socket.io-client');
module.exports = {Game: Game}




