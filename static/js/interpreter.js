

var Game = function(socket) {
  this.socket = socket;
  this.users = [];
  // this.roomName
  // this.app

//from server
  var _this = this;
  this.socket.emit('request user id', function(id){
    // _this.socketId = id; //this is slow and asynchronous but it works...
    _this.users.push(id);
    _this.app.setState({game: _this})
  });

  this.socket.on('user joined room', function(roomUsers) {
    _this.users = roomUsers;
    _this.app.setState({game: _this})
  })

// notifications
// show someone left room
// game ended
// someone played word


}
// from react

// create room
Game.prototype.createRoom = function() {
  // var roomName = Math.random().toString(36).substring(2,7);
  roomName = "funlandia"
  this.roomName = roomName;
  this.socket.emit('create room', roomName);
  console.log('created room', roomName);
};
// join room
Game.prototype.joinRoom = function(roomName) {
  var _this = this;
  this.socket.emit('request room join', roomName, function(success) {
    console.log('joined room?', success);
    if (success) {
      console.log("you joined " + roomName);
      _this.roomName = roomName;
      _this.app.setState({game: this, view: "WaitingRoom"})
    }
    else {
      console.log("you fail");
    }
  });
};
// you played word


var io = require('socket.io-client');

module.exports = { Game: Game}




