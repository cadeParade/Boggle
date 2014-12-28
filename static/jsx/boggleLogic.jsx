/** @jsx React.DOM */
var React = require('react/addons');
var $ = require('jquery');
var _ = require('underscore');
var tileSet = require('../js/tiles.js')

var cx = React.addons.classSet;


var BoggleBoard = React.createClass({
  getInitialState: function() {
    if ( this.props.type === "onePlayer") {
      console.log('tiles', this.props.tiles)
      var tiles = this.props.tiles;
    }
    else if ( this.props.type === "multiPlayer") {
      var tiles = this.props.tiles;
    }
    else {
      var tiles = [];
    }
    return({
      letterHistory: [],
      submittedWords: [],
      finalScore: 0,
      gameIsFinished: false,
      letters: tiles
    });
  },
  selectNewLetter: function(latestLetter) {
      this.setState({ letterHistory: this.state.letterHistory.concat([latestLetter]) });
  },
  unselectLastLetter: function() {
      this.setState({ letterHistory: _.initial(this.state.letterHistory) });
  },
  makeWordFromHistory: function() {
    var word = [];
    var _this = this;
    this.state.letterHistory.forEach(function(letter) {
      word.push(letter.state.letter);
    })
    var word = word.join("");
    return word;
  },
  isDuplicate: function(word) {
    if(_.contains(this.state.submittedWords, word) ) {
      return true;
    }
    return false;
  },
  clearSelection: function() {
     this.setState({
      letterHistory: [],
      })
  },
  handleSubmit: function() {
    var submission = this.makeWordFromHistory()
    var _this = this;
    if(submission.length < 3 || this.isDuplicate(submission)){
      this.clearSelection();
    }
    else {
      this.props.game.submitWord(submission, function(isWord) {
        // should only get here if it passes validation
          var submissionState = _this.state.submittedWords;
          submissionState.push(submission);
          submissionState.sort();
          _this.setState({
            letterHistory: [],
            submittedWords: submissionState
          });
      });
    }
    _this.clearSelection();

  },
  handleFinalSubmit: function() {
    this.endGame();
  },
  endGame: function() {
    this.setState({gameIsFinished: true});
    // display final score
    // stop timer
    // grey out board
    // display button to play again
  },
  render: function() {
    var numRows = 5,
        numCols = 5,
        rows = [],
        _this = this;
    _.range(numRows).forEach(function(num){
      rows.push(<BoggleRow selectNewLetter={_this.selectNewLetter}
                           unselectLastLetter={_this.unselectLastLetter}
                           letterHistory={_this.state.letterHistory}
                           rowNum={num}
                           numCols={numCols}
                           letters={_this.state.letters[num]}
                           gameIsFinished={_this.state.gameIsFinished} />)
    });

    var userScores = []

   _.each(this.props.game.room, function(data, userId) {
      userScores.push(<li>{user}: {data.score}</li>)
    })

    return (
      <div className="grid-items">
        <EndGameOverlay gameIsFinished={this.state.gameIsFinished} wordList={this.state.submittedWords} finalScore={this.state.finalScore} />

        <a href="javascript:void(0)" className="grid-item">
          <div className="boggle-board">
            {rows}
          </div>
        </a>
        <a href="javascript:void(0)" className="grid-item grid-item-big details-container">
          <div className="submissions-container">
          <div className="submissions">
            <SubmissionsBox submissions={this.state.submittedWords} />
          </div>
          <div>
            <button className="submit-button" onClick={this.handleSubmit}>Submit</button>
          </div>

          </div>
          <div className="other-details">
            <div className="timer-container"><Timer endGame={this.handleFinalSubmit} /></div>
            <div className="other-scores"><ul>{userScores}</ul></div>
          </div>
        </a>
      </div>
    )
  }
});

var EndGameOverlay = React.createClass({
  handleReplay: function() {
    location.reload();
  },
  render: function() {
    var bgClasses = cx({
      "overlay-bg":this.props.gameIsFinished,
      "hidden": !this.props.gameIsFinished,
      "display-flex": true
    })
    var insetClasses = cx({
      "final-score": this.props.gameIsFinished,
      "hidden": !this.props.gameIsFinished,
      "margin-auto": true,
    })
    var buttonClasses = cx({
      "hidden": !this.props.gameIsFinished,
      "replay-button": true,
      "margin-auto": true
    })

    var wordList = [];
    this.props.wordList.forEach(function(word) {
      wordList.push(<li>{word}</li>)
    })
    return(
      <div className={bgClasses}>
        <div className={insetClasses}>
          <div className="inset-container display-flex">
            <div className="margin-auto inset-contents">
              <h1>FINAL SCORE: {this.props.finalScore}</h1>
              <div className='submission-columns'><ul>{wordList}</ul></div>
              <button className={buttonClasses} onClick={this.handleReplay} >Replay?</button></div>
          </div>
        </div>
      </div>
    )
  }
})

var Timer = React.createClass({
  getInitialState: function() {
    return {secondsElapsed: 0,
            totalTime: 100};
  },
  tick: function() {
    if(this.state.secondsElapsed === this.state.totalTime) {
      clearInterval(this.interval);
      this.props.endGame();
    }
    else{
      this.setState({secondsElapsed: this.state.secondsElapsed + 1});
    }
  },
  componentDidMount: function() {
    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  render: function() {
    return (
      <div className="timer">{this.state.totalTime - this.state.secondsElapsed}</div>
    );
  }
});


var SubmissionsBox = React.createClass({
  render: function() {
    var submissions = [];
    this.props.submissions.forEach(function(word) {
      submissions.push(<div>{word}</div>)
    })
    return(
      <div className="idk">
        <div className="submission-columns">
          {submissions}
        </div>
      </div>
      )
  }
})

var BoggleRow = React.createClass({
  render: function() {
    var rowTiles = [];
    var _this = this;
    _.range(this.props.numCols).forEach(function(num) {
      var letter = _this.props.letters === undefined ?  "" : _this.props.letters[num];
      rowTiles.push(<BoggleTile selectNewLetter={_this.props.selectNewLetter}
                                unselectLastLetter={_this.props.unselectLastLetter}
                                letterHistory={_this.props.letterHistory}
                                rowNum={_this.props.rowNum}
                                colNum={num}
                                letter={letter}
                                gameIsFinished={_this.props.gameIsFinished} />)
    })
    return(
      <div className="boggle-row">{rowTiles}</div>
    )
  }
})

var BoggleTile = React.createClass({
  getInitialState: function() {
    return({
      letter: this.props.letter,
      // letter: this.props.tile[randNum].toUpperCase(),
    })
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({letter: nextProps.letter})
  },
  checkAdjacency: function(latestLetter) {
    var currRow = this.props.rowNum;
    var currCol = this.props.colNum;
    var latestRow = latestLetter.props.rowNum;
    var latestCol = latestLetter.props.colNum;

    var sameRow = currRow === latestRow;
    var sameCol = currCol === latestCol;

    var adjRow = currRow === latestRow + 1 || currRow === latestRow - 1;
    var adjCol = currCol === latestCol + 1 || currCol === latestCol - 1;

    var horizAdj = sameRow && adjCol;
    var vertAdj = sameCol && adjRow;
    var diagAdj = adjRow && adjCol;

    return horizAdj || vertAdj || diagAdj;
  },
  shouldSelect: function() {
    var latestLetter = _.last(this.props.letterHistory)
    var isAdjacent = this.checkAdjacency(latestLetter);
    var isNotAlreadySelected = !(_.contains(this.props.letterHistory, this));
    return isAdjacent && isNotAlreadySelected;
  },
  shouldUnselect: function() {
    var latestLetter = _.last(this.props.letterHistory)
    var isSelectedButAlsoLastLetter = _.contains(this.props.letterHistory, this) &&
                                      this.props.rowNum === latestLetter.props.rowNum &&
                                      this.props.colNum === latestLetter.props.colNum;
    return isSelectedButAlsoLastLetter;
  },
  handleClick: function() {
    if(this.props.letterHistory.length >= 1) {
      if(this.shouldSelect()) {
        this.props.selectNewLetter(this);
      }
      else if (this.shouldUnselect()) {
        this.props.unselectLastLetter();
      } else {
        // must have clicked a noncontiguous letter, do nothing
      }
    }
    else{
        //handles first click, there doesn't need to be checks
        this.props.selectNewLetter(this);
    }
  },
  render: function() {
    var tileClasses = cx({
      'boggle-tile': true,
      'box-transform-container': true,
      "no-click": this.props.gameIsFinished
    });

    var boxClasses = cx({
      "box": true,
      "select" : _.contains(this.props.letterHistory, this),
      "unselect": !(_.contains(this.props.letterHistory, this))
    })

    return (
      <div className={tileClasses} onClick={this.handleClick} >
        <div className={boxClasses}  >
            <div className='front face'>
                {this.state.letter}
            </div>
            <div className="side face">
                {this.state.letter}
            </div>
        </div>
    </div>
    );
  }
});

module.exports = BoggleBoard