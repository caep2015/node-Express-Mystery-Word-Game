const game = require('../models/middleware').game;

module.exports = {

  display: function (req, res){
    let guesses = game.numGuess;
    let blanks = game.arrayBlanks;
    let newWord = game.chooseWord();
    let display = game.gameDisplay(newWord);
    req.session.word = newWord;
    req.session.guesses = guesses;

    if(req.session.word && req.session.guesses) {
      game.gameDisplay(newWord);
      console.log(req.session.word);
    } else if (!req.session.guesses) {
      display = 'No guesses left!';``
    } else {
      newWord = game.chooseWord();
      display = game.gameDisplay(newWord);
    };

    let context = {
      lettersGuessed: game.lettersGuessed,
      arrayBlanks: game.arrayBlanks,
      wordArray: game.wordArray,
      numGuess: game.numGuess,
      player: game.player
    }

    res.render('play', context);
  },

  play: function(req, res){
    let playAgain = req.body.play;
    let ltrGuess = req.body.guess;
    if (/[^a-z]/i.test(ltrGuess)) {
      console.log('insert letter');
      game.errorMsg = true;
    } else {
      game.errorMsg = false;
    }

    ltrGuess = ltrGuess.toLowerCase();

    if (game.numGuess > 1) {
      game.end = false;
      game.checkGuess(ltrGuess);
      if (game.arrayBlanks.includes('_')) {
        game.win = false;
      } else {
        game.win = true;
      }
    } else {
      game.numGuess = 0;
      game.end = true;
      game.arrayBlanks = game.wordArray;
    };


    let context = {
      errorMsg: game.errorMsg,
      win: game.win,
      lettersGuessed: game.lettersGuessed,
      repeatedLetter: game.repeatedLetter,
      arrayBlanks: game.arrayBlanks,
      wordArray: game.wordArray,
      numGuess: game.numGuess,
      player: game.player,
      end: game.end
    }

      res.render('play', context);

  },

  resetGame: function(req, res){
    game.reset();
    res.redirect('/play');
  }

};
