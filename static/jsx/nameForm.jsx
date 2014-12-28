/** @jsx React.DOM */
var React = require('react/addons');

var NameForm = React.createClass({
  getInitialState: function() {
    return({playerName:""})// this is for the text field
  },
  handlePlayerName: function() {
    this.props.game.setPlayerName(this.state.playerName);
  },
  handleTyping: function() {
    this.setState({playerName: event.target.value});
  },
  render: function() {
    return(
      <div>
        <label htmlFor="player_name">Your name?</label>
        <input id="playerName" onChange={this.handleTyping} name="player_name" type="text" />
        <button id="player-name-input"  onClick={this.handlePlayerName}>Submit</button>
      </div>)
  }
})
module.exports = NameForm;
