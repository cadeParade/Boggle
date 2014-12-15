
/** @jsx React.DOM */
var React = require('react/addons');
var $ = require('jquery');
var _ = require('underscore');
var io = require('socket.io-client');
var ChoicePage = require('./choicePage.jsx');
var WaitingRoom = require('./waitingRoom.jsx');
var JoinRoom = require('./joinRoom.jsx');
var BoggleView = require('./boggleLogic.jsx')

var App = React.createClass({
  getInitialState: function() {
    return(
      {view: "ChoicePage"}
    )
  },
  updatePageView: function(page) {
    console.log("updatepageview in main", page)
    this.setState({view: page})
  },
  render: function() {
    if(this.state.view === "ChoicePage") {
      var page = <ChoicePage updatePageView={this.updatePageView} />;
    }
    else if (this.state.view === "WaitingRoom") {
      var page = <WaitingRoom updatePageView={this.updatePageView} />
    }
    else if (this.state.view === "JoinRoom") {
      var page = <JoinRoom updatePageView={this.updatePageView} />
    }
    else if (this.state.view === "OnePlayer") {
      var page = <BoggleView type="onePlayer" />
    }
    return(
     <div>
      {page}
    </div>
    )}
})


var app = React.render(
  <App />,
  document.getElementById('app')
);