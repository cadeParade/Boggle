/** @jsx React.DOM */

var ChoicePage = React.createClass({
  handleStartOnePlayer: function() {
    console.log('clicked')
    this.props.game.startGameSingle();
  },
  handleStartMultiPlayer: function() {
    this.props.updatePageView("NameForm");
  },
  handleJoinMultiPlayer: function() {
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
