
/** @jsx React.DOM */
var React = require('react/addons');
var $ = require('jquery');
var _ = require('underscore');
var io = require('socket.io-client');
var ChoicePage = require('./choicePage.jsx')

var WaitingRoom = React.createClass({
  render: function() {
    return(<div>Waiting Room</div>)
  }
})

var App = React.createClass({
  getInitialState: function() {
    return(
      {view: "ChoicePage"}
    )
  },
  updatePageView: function(page) {
    this.setState({view: page})
  },
  render: function() {
    if(this.state.view === "ChoicePage") {
      var page = <ChoicePage updatePageView={this.updatePageView} />;
    }
    else if (this.state.view === "WaitingRoom") {
      var page = <WaitingRoom updatePageView={this.updatePageView} />
    }
    return(
     <div>
      {page}
    </div>
      )
  }
})


var app = React.render(
  <App />,
  document.getElementById('app')
);