var models = require('./models'),
	Schema = models.Schema;

var usuarioSchema = new Schema({
    nombre : String,
    usuario : String,
    password: String,
    twitter : Schema.Types.Mixed

});

var Usuario = models.model('Usuario', usuarioSchema, 'usuario_sesion');

module.exports = Usuario;