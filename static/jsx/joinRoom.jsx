/** @jsx React.DOM */
var React = require('react/addons');

var JoinRoom = React.createClass({
  goBack: function() {
    this.props.updatePageView("ChoicePage");
  },
  render: function() {
    return(<div onClick={this.goBack}>Join Room</div>)
  }
})

module.exports = JoinRoom;
