var socket = io();

// console.log(socket)
// $('#chat-submit').submit(function(){
//   socket.emit('chat message', $('#m').val());
//   $('#m').val('');
//   return false;
// });
// socket.on('chat message', function(msg){
//   $('#messages').append($('<li>').text(msg));
//   board.setState({test: "OMG"})
// });

var updatePlayerWordList = function(player, word) {
  socket.emit("submit word", player, board.makeWordFromHistory());
}

var endGameBoth = function() {
  socket.emit("game over");
}