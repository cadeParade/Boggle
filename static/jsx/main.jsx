
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
      {view: "ChoicePage",
       socket: this.props.socket}
    )
  },
  componentDidMount: function() {
    // socket.emit('join room', 'funlandia')

  },
  updatePageView: function(page) {
    this.setState({view: page})
  },
  render: function() {
    if(this.state.view === "ChoicePage") {
      var page = <ChoicePage updatePageView={this.updatePageView} userId={this.props.userId}/>
    }
    else if (this.state.view === "WaitingRoom") {
      var page = <WaitingRoom updatePageView={this.updatePageView}  userId={this.props.userId}/>
    }
    else if (this.state.view === "JoinRoom") {
      var page = <JoinRoom updatePageView={this.updatePageView}  userId={this.props.userId}/>
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


  var socket = io();
  var userId = ""
  socket.emit('request user id');

  socket.on('return user id', function(userId){
    userId = userId;

    var app = React.render(
      <App socket={socket} userId={userId} />,
      document.getElementById('app')
    );

  })


// socket.emit('join room', 'funlandia')


