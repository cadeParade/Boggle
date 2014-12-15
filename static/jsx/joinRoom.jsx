/** @jsx React.DOM */
var React = require('react/addons');

var JoinRoom = React.createClass({
  getInitialState: function() {
    return {roomName: ""}
  },
  handleJoinRoomRequest: function() {
    console.log('clicked', this.state.roomName)
    this.props.socket.requestRoomJoin(this.state.roomName);
    // this.props.updatePageView("ChoicePage");

  },
  handleTyping: function() {
    this.setState({roomName: event.target.value});
  },
  render: function() {
    return(
      <div>
        <label htmlFor="room_name">Room name?</label>
        <input id="roomName" onChange={this.handleTyping} name="room_name" type="text" />
        <button id="joinRoom"  onClick={this.handleJoinRoomRequest}>Submit</button>
      </div>)
  }
})

module.exports = JoinRoom;
