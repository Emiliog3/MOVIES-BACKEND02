
const { Router } = require('express');                  // Se importa el módulo Router de Express para crear un enrutador

const Director = require('../models/Director'); // Se importa el modelo de Director que representa la estructura de la director en la base de datos

const { check, validationResult } = require('express-validator'); // Se importan las funciones de validación de express-validator para validar los datos de entrada del usuario

const router = Router();                                // Se crea un nuevo enrutador utilizando el Router de Express

// CREAR DIRECTOR

router.post('/', [ // Ruta para crear una nueva estadoEquipo
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), // Se valida que el campo 'nombre' no esté vacío
    check('estado', 'El estado es obligatorio').isIn(['Activo', 'Inactivo']), // Se valida que el campo 'estado' sea uno de los valores permitidos: 'Activo' o 'Inactivo'
], async function (req, res) { // Se define la ruta como POST en la URL base /estadoEquipo
    const errors = validationResult(req); // Se valida si existen errores de validación en la solicitud

    if (!errors.isEmpty()) { // Si hay errores, se devuelve una respuesta de error con los mensajes de error 
        return res.status(400).json({ mensaje: errors.array() }); // Si hay errores, se devuelve una respuesta de error con los mensajes de error
    }

    try {
        // Verificar si ya existe un estado de equipo con el mismo nombre
        const directorExistente = await Director.findOne({ nombre: req.body.nombre });
        if (directorExistente) {
            return res.status(400).json({ mensaje: 'Ya existe un director con el mismo nombre' });
        }

        let director = new Director(req.body); // Se crea un nuevo objeto estadoEquipo con los datos recibidos en la solicitud
        director.fechaCreacion = new Date(); // Se establece la fecha de creación de la estadoEquipo
        director.fechaActualizacion = new Date(); // Se establece la fecha de actualización de la estadoEquipo

        director = await director.save(); // Se guarda la estadoEquipo en la base de datos
        res.status(201).json(director); // Se devuelve una respuesta exitosa con los datos de la estadoEquipo creada
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

// ACTUALIZAR director garantizando que no exista en la base de datos una estadoEquipo con el mismo nombre

router.put('/:id', [ // Ruta para actualizar una estadoEquipo
    
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), // Se valida que el campo 'nombre' no esté vacío
    check('estado', 'El estado es obligatorio').isIn(['Activo', 'Inactivo']), // Se valida que el campo 'estado' sea uno de los valores permitidos: 'Activo' o 'Inactivo'
], async function (req, res) { // Se define la ruta como PUT en la URL base /estadoEquipo/:id
    const errors = validationResult(req); // Se valida si existen errores de validación en la solicitud

    if (!errors.isEmpty()) { // Si hay errores, se devuelve una respuesta de error con los mensajes de error 
        return res.status(400).json({ mensaje: errors.array() }); // Si hay errores, se devuelve una respuesta de error con los mensajes de error
    }

    try {
        const { id } = req.params; // Se obtiene el ID de la estadoEquipo a actualizar
        const director = await Director.findById(id); // Se busca la estadoEquipo en la base de datos por su ID

        if (!director) { // Si la estadoEquipo no existe, se devuelve una respuesta de error
            return res.status(404).json({ mensaje: 'Director no encontrado' });
        }

        // Verificar si ya existe un director con el mismo nombre
        const directorExistente = await Director.findOne({ nombre: req.body.nombre });
        if (directorExistente && directorExistente._id != id) {
            return res.status(400).json({ mensaje: 'Ya existe un director con el mismo nombre' });
        }

        director.nombre = req.body.nombre; // Se actualiza el nombre de la estadoEquipo
        director.estado = req.body.estado; // Se actualiza el estado de la estadoEquipo
        director.descripcion = req.body.descripcion; // Se actualiza la descripción de la estadoEquipo
        director.fechaActualizacion = new Date(); // Se actualiza la fecha de actualización de la estadoEquipo

        await director.save(); // Se guarda la estadoEquipo actualizada en la base de datos
        res.json(director); // Se devuelve una respuesta exitosa con los datos de la estadoEquipo actualizada
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

// OBTENER TODOS LOS DIRECTORES

router.get('/', async function (req, res) { // Se define la ruta como GET en la URL base /director
    try {
        const directores = await Director.find(); // Se buscan todos los directores en la base de datos
        res.json(directores); // Se devuelven los directores encontrados
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});


// ELIMINAR DIRECTOR

router.delete('/:id', async function (req, res) { // Se define la ruta como DELETE en la URL base /director/:id
    try {
        const { id } = req.params; // Se obtiene el ID del director a eliminar
        const result = await Director.deleteOne({ _id: id }); // Se elimina el director de la base de datos

        if (result.deletedCount === 0) { // Si no se eliminó ningún documento, el director no fue encontrado
            return res.status(404).json({ mensaje: 'Director no encontrado' });
        }

        res.json({ mensaje: 'Director eliminado' }); // Se devuelve una respuesta exitosa
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error interno del servidor o Director no encontrado' });
    }
});





module.exports = router; // Se exporta el enrutador para ser utilizado en otras partes de la aplicación