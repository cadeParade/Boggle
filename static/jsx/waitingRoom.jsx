/** @jsx React.DOM */
var React = require('react/addons');

var WaitingRoom = React.createClass({
  getInitialState: function() {
    var roomName = Math.random().toString(36).substring(2,7);
    this.props.socket.createRoom(roomName)
    return ({roomName: roomName,
            you: this.props.userId,
            users: [this.props.userId]});

  },
  backToChoice: function() {
    this.props.updatePageView("ChoicePage");
  },
  render: function() {
    var users = []
    this.state.users.forEach(function(userId) {
      users.push(<li>{userId}</li>);
    })
    return(
      <div>
        <p>You are in the Waiting Room</p>
        <p>Your room name is {this.state.roomName}</p>
        <div>People currently Connected:
        <ul>{users}
        </ul></div>
        <p>... waiting on other people to join...</p>
        <p>... dont you have any friends? ...</p>
        <button onClick={this.backToChoice}>Back to choice </button>
      </div>
    )
  }
})

module.exports = WaitingRoom;
