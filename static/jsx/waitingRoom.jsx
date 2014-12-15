/** @jsx React.DOM */
var React = require('react/addons');

var WaitingRoom = React.createClass({
  backToChoice: function() {
    this.props.updatePageView("ChoicePage");
  },
  render: function() {
    return(<div onClick={this.backToChoice}>Waiting Room</div>)
  }
})

module.exports = WaitingRoom;
