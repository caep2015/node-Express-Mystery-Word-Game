const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const parseurl = require('parseurl');
const fs = require('fs');

const app = express();
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

//app selects random word
const WORDS = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

let word = '';
// get random word
let chooseWord = function(){
  let chosenWord = '';
  let randomIndex = Math.floor(Math.random() * WORDS.length);
  chosenWord = WORDS[randomIndex];
  //check word length
  if (chosenWord.length <= 8 && chosenWord.length >= 4) {
    word = chosenWord;
    return word;
  } else {
    return chooseWord();
  }
};
//game variables
let randomWord = chooseWord();
let player = '';
//arrays of blanks
let arrayBlanks = [];
let wordArray = Array.from(randomWord);
let attemptedLetters = [];
let numGuess = 8;
console.log ('guesses: ', numGuess);

//add express session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}));
//store word
app.use((req, res, next) => {
  let storedWord = req.session.store;
  storedWord = randomWord;
  //console.log('storedWord: ', storedWord);
  next();
});
//require name
app.use((req, res, next) => {
  let pathname = parseurl(req).pathname;
  if (!req.session.user && pathname != '/index') {
    res.redirect('/index');
  } else {
    next();
  }
});

//set endpoints
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/index', (req, res)=> {
  res.render('index', {});
});

app.get('/', (req, res)=> {
  for (let i = 0; i < randomWord.length; i++) {
    arrayBlanks[i] = '_';
  };

  let context = {
    numGuess: numGuess,
    player: player,
    arrayBlanks: arrayBlanks
  };

res.render('game', context);
});

//guessing form

app.post('/game', (req, res) => {
  let counter = 0;
  let ltrGuess = req.body.guess;
  let repeatedLetters = [];
  ltrGuess = ltrGuess.toLowerCase();
  attemptedLetters.push(ltrGuess.toUpperCase());
//check letters
  for (let i = 0; i < attemptedLetters.length; i++) {
    if (ltrGuess === attemptedLetters[i]) {
      repeatedLetters.push(letterGuess.toUpperCase());
      console.log('repeats: ', repeatedLetters);
    }
  };

  for (let i = 0; i < wordArray.length; i++) {
    counter ++;
    if (letterGuess === wordArray[i]) {
      arrayBlanks[counter - 1] = ltrGuess;
    };
  };


  let context = {
    player: player,
    arrayBlanks: arrayBlanks,
    attemptedLetters: attemptedLetters,
    repeatedLetters: repeatedLetters
  };

  res.render('game', context);
});

app.listen(3000, function(){
  console.log('Listening on port 3000...')
});
