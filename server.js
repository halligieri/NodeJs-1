(function (){
    var express = require('express'),
        app = express(),
        server = require('http').createServer(app),
        io = require('socket.io')(server),
        _ = require('lodash'),
        usuarios = [],
        session = require('express-session'),
        RedisStore = require('connect-redis')(session),
        multipart = require('connect-multiparty'),
        passport = require('passport'),
        flash = require('connect-flash'),
        logger = require('morgan'),
        cookieParser = require('cookie-parser'),
        bodyParser = require('body-parser'),
        path = require('path'),
        swig = require('swig'),
        uniqid = require('uniqid');


    app.engine('html', swig.renderFile);
    app.set('view engine', 'html');
    app.set('views', __dirname + '/views');

    app.set('view cache', false);
    swig.setDefaults({ cache: false });

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));


    app.use(session({
        store : new RedisStore({}),
        secret : 'nextapp'
    }));

    app.use(multipart());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    passport.serializeUser(function(user, done) {
        console.log("Serialize: "+user);
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        console.log("Deserialize: "+obj);
        done(null, obj);
    });



    var routes = require('./routes/routes');
    routes(app, swig);


    var local = require('./connections/local');
    local(app);
    var twitter = require('./connections/twitter');
    twitter(app);


    var port = Number(process.env.PORT || 3000);

    io.sockets.on('connection', function(socket) {
        console.log('Usuario Conectado');

        socket.on('disconnect', function () {
            console.log('Usuario desconectado.');
        });

        socket.on('draw',function(e){
            io.sockets.emit('move', e);
        });

    });

    server.listen(3000, function(){
        console.log('Servidor corriendo en puerto: 3000');
    });
}());
