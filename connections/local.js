
var passport = require('passport'),
    passportLocal = require('passport-local'),
    LocalStrategy = passportLocal.Strategy,
    Usuario = require('../models/usuario');

var localConnection = function (app) {
    passport.use('user', new LocalStrategy({
        usernameField: 'usuario',
        passwordField: 'password'
    },
    function (username, password, done) {
        console.log('Usuario: ' + username);
        console.log('Clave: ' + password);
        Usuario.findOne({usuario: username}, function (err, user) {
            console.log('Error: ' + err);
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {message: 'Incorrect username.'});
            } else {
                if (user.password != password) {
                    return done(null, false, {message: 'Incorrect password.'});
                } else {
                    return done(null, user);
                }
            }
        });
    }
    ));
    app.post('/login', passport.authenticate('user', {successRedirect: '/main', failureRedirect: '/error', failureFlash: 'Usuario o contraseña incorrectos.'}));

};


module.exports = localConnection;
