/** @jsx React.DOM */
var React = require('react/addons');

var WaitingRoom = React.createClass({

  backToChoice: function() {
    this.props.updatePageView("ChoicePage");
  },
  handleStartGame: function() {
    console.log('starting game')
    this.props.game.startGame();
  },
  render: function() {
    var users = []
    this.props.game.users.forEach(function(userId) {
      users.push(<li>{userId}</li>);
    })
    return(
      <div>
        <p>You are in the Waiting Room</p>
        <p>Your room name is {this.props.game.roomName}</p>
        <div>People currently Connected:
        <ul>{users}
        </ul></div>
        <p>... waiting on other people to join...</p>
        <p>... dont you have any friends? ...</p>
        <div><button onClick={this.handleStartGame}>Start Game </button></div>
        <button onClick={this.backToChoice}>Back to choice </button>
      </div>
    )
  }
})

module.exports = WaitingRoom;
