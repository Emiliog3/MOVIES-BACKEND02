const { Schema, model } = require('mongoose');  // Se importa el constructor de esquemas y el modelo de Mongoose

const ProductoraSchema = new Schema({
    
        nombre: { type: String, required: true },                                   // Nombre de la productora
        estado: { type: String, required: true, enum: ['Activo', 'Inactivo'] },     // Estado de la productora
        fechaCreacion: { type: Date, required: true, default: Date.now },           // Fecha de creación de la productora
        fechaActualizacion: { type: Date, required: true, default: Date.now },      // Fecha de actualización de la productora
        slogan: { type: String, required: true },                                   // Slogan de la productora
        descripcion: { type: String, required: true }                               // Descripción de la productora
});

// Exportar el modelo

module.exports = model('Productora', ProductoraSchema);       // Se exporta el modelo de productora con el nombre 'Productora' y el esquema creado

