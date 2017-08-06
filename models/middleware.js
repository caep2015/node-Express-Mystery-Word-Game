const fs = require('fs');

module.exports = {
  game: {
    WORDS: fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n"),
    playerName: '',
    attemptedLetters: [],
    repeatedLetter: [],
    numGuess: 8,
    arrayBlanks: [],
    wordArray: [],
    randomWord: '',
    win: false,
    end: false,
    errorMsg: false,

    chooseWord: function() {
      let chosenWord = '';
      let randomIndex = Math.floor(Math.random() * this.WORDS.length);
      chosenWord = this.WORDS[randomIndex];

      if (chosenWord.length <= 8 && chosenWord.length >= 4) {
        this.randomWord = chosenWord;
        this.wordArray = Array.from(this.randomWord);
        return this.randomWord;
      } else {
        return this.chooseWord();
      }
    },

    gameDisplay: function(word) {
      for (let i = 0; i < this.wordArray.length; i++) {
        this.arrayBlanks[i] = '_';
      };
      return this.arrayBlanks;
    },

    checkGuess: function(letter) {
      let counter = 0;
      let duplicate = false;
      let correct = false;

      if (this.attemptedLetters) {
        for (let i = 0; i < this.attemptedLetters.length; i++) {
          if (letter === this.attemptedLetters[i]) {
            this.repeatedLetter.push(letter);
            duplicate = true;
            return true;
          }
        };
        this.repeatedLetter = [];
      }

      this.attemptedLetters.push(letter);

      for (let i = 0; i < this.wordArray.length; i++) {
        counter++;
        if (letter === this.wordArray[i]) {
          this.arrayBlanks[counter - 1] = letter;
          correct = true;
        }
      };

      if (!duplicate && !correct && this.numGuess >= 1) {
        this.numGuess--;
      } else if (correct && this.numGuess != 0) {}

    },

    reset: function() {
      this.arrayBlanks = [];
      this.attemptedLetters = [];
      this.repeatedLetter = [];
      this.numGuess = 8;
      this.wordArray = [];
      this.randomWord = '';
      this.win = false;
    }

  },


};
