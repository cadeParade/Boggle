/** @jsx React.DOM */


var cx = React.addons.classSet;


var BoggleBoard = React.createClass({
  getInitialState: function() {
    return({
      letterHistory: [],
      submittedWords: [],
      finalScore: 0,
      gameIsFinished: false,
      test: "test"
    })
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
      $.post('/check_word', {word: submission}, function(isWord){
        if(isWord.isValidWord === true){
          var submissionState = _this.state.submittedWords;
          submissionState.push(submission);
          submissionState.sort();
          updatePlayerWordList(_this.props.players, submission)
          _this.setState({
            letterHistory: [],
            submittedWords: submissionState
          });
        }
        else{
          _this.clearSelection();
        }
      });
    }
  },
  scoreWord: function(wordArray) {
    var wordScore = 0;
    var wordLength = wordArray.length;
    if(wordLength >= 3) {
      wordScore = 1;
      if(wordLength > 4) {
        wordScore = wordScore + (wordLength - 4);
      }
    }
    return wordScore;
  },
  handleFinalSubmit: function() {
    var finalScore = 0;
    var _this = this;
    this.state.submittedWords.forEach(function(wordArray) {
      finalScore = finalScore + _this.scoreWord(wordArray);
    })
    this.setState({finalScore: finalScore,
                   submittedWords: []});
    this.endGame();
  },
  endGame: function() {
    this.setState({gameIsFinished: true})
    // display final score
    // stop timer
    // grey out board
    // display button to play again
  },
  render: function() {
    var numRows = 5,
        numCols = 5,
        rows = [],
        tiles = tileSet(),
        _this = this;
        console.log(this.state.finalScore)
        console.log(this.props.players)
    _.range(numRows).forEach(function(num){
      rows.push(<BoggleRow selectNewLetter={_this.selectNewLetter}
                           unselectLastLetter={_this.unselectLastLetter}
                           letterHistory={_this.state.letterHistory}
                           rowNum={num}
                           numCols={numCols}
                           tiles={tiles[num]}
                           gameIsFinished={_this.state.gameIsFinished} />)
    })

    return (
  <div className="row">
  {this.props.players}<br/>
  {this.state.test}
    <EndGameOverlay gameIsFinished={this.state.gameIsFinished} finalScore={this.state.finalScore} />
    <div className="large-12 columns">
        <div className="row">
          <div className="large-4 columns">
            <div className="boggle-board">
              {rows}
            </div>
          </div>

          <div className="large-8 columns">
              <SubmissionsBox submissions={this.state.submittedWords} />

              <div className="row">
                  <div className="large-6 small-6 columns submit-word-button">
                      <button onClick={this.handleSubmit}>Submit</button>
                  </div>
                  <div className="large-6 small-6 columns">
                      <button onClick={this.handleFinalSubmit}>Score me</button>
                  </div>
              </div>
          </div>
        </div>
    </div>
    <Timer endGame={this.handleFinalSubmit} />
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
    return(
      <div className={bgClasses}>
        <div className={insetClasses}>
          <div className="inset-container display-flex">
            <div className="margin-auto inset-contents">
              <h1>FINAL SCORE: {this.props.finalScore}</h1>
              <button className={buttonClasses} onClick={this.handleReplay} >Replay?</button></div>
          </div>
        </div>
      </div>
    )
  }
})

var Timer = React.createClass({
  getInitialState: function() {
    return {secondsElapsed: 0};
  },
  tick: function() {
    if(this.state.secondsElapsed === 500) {
    // if(this.state.secondsElapsed === 60) {
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
      <div>Seconds Elapsed: {this.state.secondsElapsed}</div>
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
      <div className="panel submissions-box ">
        <div className="submissions-title">
          <h3>Submissions</h3>
        </div>
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
      rowTiles.push(<BoggleTile selectNewLetter={_this.props.selectNewLetter}
                                unselectLastLetter={_this.props.unselectLastLetter}
                                letterHistory={_this.props.letterHistory}
                                rowNum={_this.props.rowNum}
                                colNum={num}
                                tile={_this.props.tiles[num]}
                                gameIsFinished={_this.props.gameIsFinished} />)
    })
    return(
      <div className="boggle-row">{rowTiles}</div>
    )
  }
})

var BoggleTile = React.createClass({
  getInitialState: function() {
    var randNum = Math.floor(Math.random() * (5 - 0 + 1)) + 0; //random int from 0-5
    return({
      letter: this.props.tile[randNum].toUpperCase(),
    })
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

var tileSet = function(){
var tiles = [["a","a","a","f","r","s"],
            ["a","a","e","e","e","e"],
            ["a","a","f","i","r","s"],
            ["a","d","e","n","n","n"],
            ["a","e","e","e","e","m"],
            ["a","e","e","g","m","u"],
            ["a","e","g","m","n","n"],
            ["a","f","i","r","s","y"],
            ["b","j","k","qu","x","z"],
            ["c","c","e","n","s","t"],
            ["c","e","i","i","l","t"],
            ["c","e","i","l","p","t"],
            ["c","e","i","p","s","t"],
            ["d","d","h","n","o","t"],
            ["d","h","h","l","o","r"],
            ["d","h","l","n","o","r"],
            ["d","h","l","n","o","r"],
            ["e","i","i","i","t","t"],
            ["e","m","o","t","t","t"],
            ["e","n","s","s","s","u"],
            ["f","i","p","r","s","y"],
            ["g","o","r","r","v","w"],
            ["i","p","r","r","r","y"],
            ["n","o","o","t","u","w"],
            ["o","o","o","t","t","u"]]

  var shuff_tiles = _.shuffle(tiles);
  var arrays = [],
      size = 5;

  while (shuff_tiles.length > 0)
      arrays.push(shuff_tiles.splice(0, size));
  return arrays
}

var board = React.render(
  <BoggleBoard players={"<%= players %>"}/>,
  document.getElementById('content')
);
