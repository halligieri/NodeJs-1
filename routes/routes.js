var usuario = require('../controllers/usuario'),
    fs = require('fs');

var rutas = function (app, swig) {

    app.get('/registro', function (req, res) {
        res.render('crear_usuario');
    });

    app.get('/', function (req, res) {
        res.render('login');
    });


    app.get('/main', function (req, res) {
        var imagenes = [];
        fs.readdir(__dirname  + '/../public/gallery/', function (err, archivos) {
            if (!err) {
                for (var i = 0;i < archivos.length;i++) {
                    imagenes.push('gallery/' + archivos[i]);
                }
            } else {
                console.log(err);
            }
        });
        swig.renderFile(__dirname + '/../views/main.html', {usuario: req.session.passport.user.nombre, imagenes: imagenes}, function (err, output) {
            if (err) {
                throw err;
            }
            res.send(output);
            res.end();
        });
    });

    app.get('/error', function (req, res) {
        res.send(req.session.flash.error[0]);
    });
    
    app.get('/upload', function (req, res) {
        swig.renderFile(__dirname + '/../views/cargar_imagen.html', {usuario: req.session.passport.user.nombre}, function (err, output) {
            if (err) {
                throw err;
            }
            res.send(output);
            res.end();
        });
    });   


    app.post('/registro', usuario.agregarUsuario, function (req, res) {
        res.redirect('/');
    });
    
    app.post('/uploadFile', usuario.cargarImagen, function (req, res) {
        res.redirect('/main');
    }); 
    
    app.post('/edit', function (req, res) {
        swig.renderFile(__dirname + '/../views/editar_imagen.html', {idImagen: req.body.idImagen, usuario: req.session.passport.user.nombre}, function (err, output) {
            if (err) {
                throw err;
            }
            res.send(output);
            res.end();
        });        
    });
};

module.exports = rutas;