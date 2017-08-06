const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const parseurl = require('parseurl');
const playController = require('./controllers/play-controllers');
const indexController = require('./controllers/index-controllers');

const app = express();

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  }));

  app.use((req, res, next) => {
    let pathname = parseurl(req).pathname;
    if (!req.session.user && pathname != '/index'){
      res.redirect('/index');
    } else {
      next();
    }
  })

  app.get('/', (req, res) => {
    res.redirect('/index');
  });

  app.get('/index', indexController.display);

  app.get('/play', playController.display);

  app.post('/index', indexController.submitName);

  app.post('/play', playController.play);

  app.get('/reset', playController.resetGame);


app.listen(3000, function(){
  console.log('Drumroll please...')
});
