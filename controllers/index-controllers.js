const game = require('../models/middleware').game;

module.exports = {
  display: function(req, res){
    res.render('index', {});
  },

  submitName: function(req, res){
    game.player = req.body.name;
    if (game.player) {
      req.session.user = game.player;
    };

    if(req.session.user){
      res.redirect('/play');
    } else {
      res.redirect('/index');
    }

  }

};
