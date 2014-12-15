/** @jsx React.DOM */
var React = require('react/addons');

var ChoicePage = React.createClass({
  handleStartOnePlayer: function() {
    this.props.updatePageView("OnePlayer")
    console.log("start one player")
  },
  handleStartMultiPlayer: function() {
    console.log("start multi player");
    console.log(this.props)
    this.props.updatePageView("WaitingRoom")
  },
  handleJoinMultiPlayer: function() {
    console.log("join multi player")
    this.props.updatePageView("JoinRoom");
  },
  render: function() {
    return(
    <div className="cards">
      <div onClick={this.handleStartOnePlayer}>One player</div>
      <div onClick={this.handleStartMultiPlayer}>Mutli player start</div>
      <div onClick={this.handleJoinMultiPlayer}>Multi Player Join</div>
    </div>
    )}
});

module.exports = ChoicePage;
