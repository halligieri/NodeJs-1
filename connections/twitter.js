var passport = require('passport'),
        passportTwitter = require('passport-twitter'),
        TwitterStrategy = passportTwitter.Strategy;

var Usuario = require('../models/usuario');

var twitterConnection = function (app) {
    passport.use(new TwitterStrategy({
        consumerKey: 'FIbWbCoFaETXfXf1jf5zedYJQ',
        consumerSecret: '	fNZdt3tI74AgmGjkeb11rrVtAr2pC3Cjcg0b7NMkr8kGcf23tK',
        callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
    },
    function (token, tokenSecret, profile, done) {
        Usuario.findOne({
            'twitter.id': profile.id
        },
        function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                var usuario = new Usuario({
                    username: profile.username,
                    twitter: profile
                });
                var datos = JSON.stringify(eval("(" + profile._raw + ")"));
                usuario.nombre = JSON.parse(datos).name;
                usuario.save(function (err, user) {
                    if (err) {
                        done(err, null);
                        return;
                    }
                    done(null, user);
                });
            } else {
                return done(err, user);
            }
        });
    }
));

    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback', passport.authenticate('twitter', {successRedirect: '/main', failureRedirect: '/error'}));
};

module.exports = twitterConnection;
