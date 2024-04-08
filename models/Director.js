const { Schema, model } = require('mongoose');

const DirectorSchema = new Schema({

    nombre: { type: String, required: true },                               // Nombre del director
    estado: { type: String, required: true, enum: ['Activo', 'Inactivo'] }, // Estado del director
    fechaCreacion: { type: Date, required: true, default: Date.now },       // Fecha de creación del director
    fechaActualizacion: { type: Date, required: true, default: Date.now }   // Fecha de actualización del director
});

// Exportar el modelo

module.exports = model('Director', DirectorSchema);       // Se exporta el modelo de director con el nombre 'Director' y el esquema creado

