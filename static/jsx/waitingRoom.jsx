/** @jsx React.DOM */
var React = require('react/addons');
var _ = require('underscore');

var WaitingRoom = React.createClass({
  backToChoice: function() {
    this.props.updatePageView("ChoicePage");
  },
  handleNameEntry: function() {
    this.setState({view: "waitingRoom"});
  },
  handleStartGame: function() {
    console.log('starting game');
    this.props.game.startGameMulti();
  },
  render: function() {
    var users = [];
    console.log(this.props.game.room);
    _.each(this.props.game.room, function(data, userId) {
      users.push(<li>{data.playerName}</li>);
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
});

module.exports = WaitingRoom;
