const { Router } = require('express');
const Genero = require('../models/Genero');
const { check, validationResult } = require('express-validator');
const router = Router();


// CREAR GÉNERO

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
    check('estado', 'El estado es obligatorio').isIn(['Activo', 'Inactivo']), // Se valida que el campo 'estado' sea uno de los valores permitidos: 'Activo' o 'Inactivo'
], async function (req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ mensaje: errors.array() });
    }

    try {
        const generoExistente = await Genero.findOne({ nombre: req.body.nombre });
        if (generoExistente) {
            return res.status(400).json({ mensaje: 'Ya existe un género con el mismo nombre' });
        }

        let genero = new Genero(req.body);
        genero.fechaCreacion = new Date();
        genero.fechaActualizacion = new Date();

        genero = await genero.save();
        res.status(201).json(genero);
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

// ACTUALIZAR GÉNERO

router.put('/:id', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
    check('estado', 'El estado es obligatorio').isIn(['Activo', 'Inactivo']), // Se valida que el campo 'estado' sea uno de los valores permitidos: 'Activo' o 'Inactivo'
], async function (req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ mensaje: errors.array() });
    }

    try {
        const { id } = req.params;
        const genero = await Genero.findById(id);

        if (!genero) {
            return res.status(404).json({ mensaje: 'Género no encontrado' });
        }

        const generoExistente = await Genero.findOne({ nombre: req.body.nombre });
        if (generoExistente && generoExistente._id != id) {
            return res.status(400).json({ mensaje: 'Ya existe un género con el mismo nombre' });
        }

        genero.nombre = req.body.nombre;
        genero.descripcion = req.body.descripcion;
        genero.estado = req.body.estado; // Se actualiza el estado de la estadoEquipo
        
        genero.fechaActualizacion = new Date();

        await genero.save();
        res.json(genero);

    } catch (error) {

        console.log(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });

    }
});

// LISTAR GÉNEROS

router.get('/', async function (req, res) {
    try {
        const generos = await Genero.find();
        res.json(generos);

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }

});

// ELIMINAR GÉNERO

router.delete('/:id', async function (req, res) {
    try {
        const { id } = req.params;
        const genero = await Genero.findByIdAndDelete(id);

        if (!genero) {
            return res.status(404).json({ mensaje: 'Género no encontrado' });
        }
        res.json(genero);

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error interno del servidor o Género no encontrado' });
    }
});

module.exports = router; 
