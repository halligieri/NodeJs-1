var Usuario = require('../models/usuario'),
    fs = require('fs'),
    uniqid = require('uniqid');

exports.agregarUsuario = function (req, res, next) {
    var user = new Usuario({
        nombre: req.body.nombre,
        usuario: req.body.usuario,
        password: req.body.password
    });
    user.save(function (err, usuario) {
        if (!err) {
            res.status(201);
            next();
        } else {
            res.status(400);
            res.send('Ha ocurrido un problema!');
        }
    });    
};

exports.cargarImagen = function (req, res, next) {
    try {
        var imgPath = '',
            galleryPath = __dirname + '/../public/gallery/',
            extension = '.' + req.files.inpUpload.originalFilename.split('.')[1];
        imgPath = galleryPath + uniqid() + extension;
        tmpFile = req.files.inpUpload.path;
        var writeStream = fs.createWriteStream(imgPath);
        var readStream = fs.createReadStream(tmpFile);
        readStream.pipe(writeStream);
        res.status(201);
        next();        
    } catch (err) {
        res.status(400);
        res.send('Ocurrió un error al cargar el archivo: ' + err);     
    }
};


