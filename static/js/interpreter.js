var Game = function(socket) {
  this.socket = socket;
  this.users = [];
  this.tiles = [];
  // this.roomName -- assigned later
  // this.app -- assigned later

//from server
  var _this = this;
  this.socket.emit('request user id', function(id){
    _this.users.push(id);
    _this.app.setState({game: _this})
  });

  this.socket.on('user joined room', function(roomUsers) {
    _this.users = roomUsers;
    _this.app.setState({game: _this})
  })

  this.socket.on('start game', function(tiles) {
    _this.app.setState({view: "multiPlayer", tiles: tiles})
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

Game.prototype.startGame = function() {
  this.socket.emit('start game for all room users', this.roomName)
};

// TODO:
// you played word


var io = require('socket.io-client');
module.exports = { Game: Game}




