const { Schema, model } = require('mongoose');  // Se importa el constructor de esquemas y el modelo de Mongoose

const TipoSchema = new Schema({
    
        nombre: { type: String, required: true },                                   // Nombre del tipo
        fechaCreacion: { type: Date, required: true, default: Date.now },           // Fecha de creación del tipo
        fechaActualizacion: { type: Date, required: true, default: Date.now },      // Fecha de actualización del tipo
        descripcion: { type: String, required: true }                               // Descripción del tipo
});
    
// Exportar el modelo

module.exports = model('Tipo', TipoSchema);       // Se exporta el modelo de tipo con el nombre 'Tipo' y el esquema creado

