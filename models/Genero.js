const { Schema, model } = require('mongoose');  // Se importa el constructor de esquemas y el modelo de Mongoose

const GeneroSchema = new Schema({

    nombre: { type: String, required: true },                                   // Nombre del género
    fechaCreacion: { type: Date, required: true, default: Date.now },           // Fecha de creación del género
    fechaActualizacion: { type: Date, required: true, default: Date.now },      // Fecha de actualización del género
    descripcion: { type: String, required: true }                               // Descripción del género

    });

// Exportar el modelo

module.exports = model('Genero', GeneroSchema);       // Se exporta el modelo de género con el nombre 'Genero' y el esquema creado

