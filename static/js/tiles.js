var _ = require('underscore-node');

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

module.exports = function() {
      // var tileSet = function(tiles){
  var shuff_tiles = _.shuffle(tiles),
      letters = [],
      arrays = [],
      size = 5

  shuff_tiles.forEach(function(tile){
    var randNum = Math.floor(Math.random() * (5 - 0 + 1)) + 0; //random int from 0-5
    letters.push(tile[randNum] === "qu" ? "Qu" : tile[randNum].toUpperCase())
  })
  //makes array of 5 arrays
  while (letters.length > 0) {
    arrays.push(letters.splice(0, size));
  }
  console.log(arrays, "arrays?")
  return arrays
}

