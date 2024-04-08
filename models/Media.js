// media.js
const { Schema, model } = require('mongoose');

const MediaSchema = new Schema({
    serial: { type: String, required: true, unique: true },
    titulo: { type: String, required: true },
    sinopsis: { type: String, required: true },

    //Utilizar unique: false para que no sea obligatorio

    url: { type: String, required: true, unique: false },
    imagen: { type: String, required: true },
    anioEstreno: { type: String, required: true },
    genero: { type: Schema.Types.ObjectId, ref: 'Genero', required: true },
    director: { type: Schema.Types.ObjectId, ref: 'Director', required: true },
    productora: { type: Schema.Types.ObjectId, ref: 'Productora', required: true },
    tipo: { type: Schema.Types.ObjectId, ref: 'Tipo', required: true },
    fechaCreacion: { type: Date, default: Date.now }, // Agregar campo fechaCreacion
    fechaActualizacion: { type: Date, default: Date.now } // Agregar campo fechaActualizacion
});

module.exports = model('Media', MediaSchema);


