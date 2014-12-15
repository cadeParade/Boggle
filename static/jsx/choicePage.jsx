var React = require('react/addons');

var ChoicePage = React.createClass({
  handleStartOnePlayer: function() {
    console.log("start one player")
  },
  handleStartMultiPlayer: function() {
    console.log("start multi player");
    console.log(this.props)
    this.props.updatePageView("WaitingRoom")
  },
  handleJoinMultiPlayer: function() {
    console.log("join multi player")
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
