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
  let chosenIndex = Math.floor(Math.random() * WORDS.length);
  chosenWord = WORDS[chosenIndex];
//  console.log('chosenWord: ' chosenWord);
  //check word length
  if (chosenWord.length <= 8 && chosenWord.length >= 4) {
    word = chosenWord;
    console.log('word in function: ', word);
    return word;
  } else {
    return chooseWord();
  }
};
//computer word
let randomWord = chooseWord();
//console.log('randomWord: ', randomWord);

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
//arrays of blanks
let arrayBlanks = [];
let wordArray = Array.from(randomWord);
let attemptedLetters = [];
console.log('wordArray ', wordArray);
//set endpoints
app.get('/', (req, res)=>{
  for(let i = 0; i < randomWord.length; i++) {
    arrayBlanks[i] = '_';
  };

  context = {
    arrayBlanks: arrayBlanks
  };

//  res.render('index', context);
//});

app.post('/', (req, res) => {
  let counter = 0;
  let numGuess = 8;
  let ltrGuess = req.body.text;
  ltrGuess = ltrGuess.toLowerCase();
  attemptedLetters.push(ltrGuess.toUpperCase());

  for (let i = 0; i < wordArray.length; i++) {
    counter ++;
    numGuess --;
    if (letterGuess === wordArray[i]) {
      arrayBlanks[counter - 1] = ltrGuess;
    };
  };

  context = {
    arrayBlanks: arrayBlanks,
    attemptedLetters: attemptedLetters,
    numGuess: numGuess
  };

  res.render('index', context);
});

app.listen(3000, function(){
  console.log('Listening on port 3000...')
});
