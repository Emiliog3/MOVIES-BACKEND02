
const { Router } = require('express');                  // Se importa el módulo Router de Express para crear un enrutador

const Genero = require('../models/Genero'); // Se importa el modelo de Genero que representa la estructura de la genero en la base de datos

const { check, validationResult } = require('express-validator'); // Se importan las funciones de validación de express-validator para validar los datos de entrada del usuario

const router = Router();                                // Se crea un nuevo enrutador utilizando el Router de Express


// CREAR GENERO

router.post('/', [ // Ruta para crear un nuevo genero
    
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), // Se valida que el campo 'nombre' no esté vacío
    check('estado', 'El estado es obligatorio').isIn(['Activo', 'Inactivo']), // Se valida que el campo 'estado' sea uno de los valores permitidos: 'Activo' o 'Inactivo'
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(), // Se valida que el campo 'descripcion' no esté vacío

], async function (req, res) { // Se define la ruta como POST en la URL base /genero
    const errors = validationResult(req); // Se valida si existen errores de validación en la solicitud

    if (!errors.isEmpty()) { // Si hay errores, se devuelve una respuesta de error con los mensajes de error 
        return res.status(400).json({ mensaje: errors.array() }); // Si hay errores, se devuelve una respuesta de error con los mensajes de error
    }

    try {
        // Verificar si ya existe un genero con el mismo nombre
        const generoExistente = await Genero.findOne({ nombre: req.body.nombre });
        if (generoExistente) {
            return res.status(400).json({ mensaje: 'Ya existe un genero con el mismo nombre' });
        }

        let genero = new Genero(req.body); // Se crea un nuevo objeto genero con los datos recibidos en la solicitud
        genero.fechaCreacion = new Date(); // Se establece la fecha de creación de la genero
        genero.fechaActualizacion = new Date(); // Se establece la fecha de actualización de la genero

        genero = await genero.save(); // Se guarda la genero en la base de datos
        res.status(201).json(genero); // Se devuelve una respuesta exitosa con los datos de la genero creada
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

// ACTUALIZAR GÉNERO garantizando que no exista en la base de datos una genero con el mismo nombre

router.put('/:id', [ // Ruta para actualizar una genero
    
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), // Se valida que el campo 'nombre' no esté vacío
    check('estado', 'El estado es obligatorio').isIn(['Activo', 'Inactivo']), // Se valida que el campo 'estado' sea uno de los valores permitidos: 'Activo' o 'Inactivo'
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(), // Se valida que el campo 'descripcion' no esté vacío
], async function (req, res) { // Se define la ruta como PUT en la URL base /genero/:id
    const errors = validationResult(req); // Se valida si existen errores de validación en la solicitud

    if (!errors.isEmpty()) { // Si hay errores, se devuelve una respuesta de error con los mensajes de error 
        return res.status(400).json({ mensaje: errors.array() }); // Si hay errores, se devuelve una respuesta de error con los mensajes de error
    }

    try {
        const { id } = req.params; // Se obtiene el ID de la genero a actualizar
        const genero = await Genero.findById(id); // Se busca la genero en la base de datos por su ID

        if (!genero) { // Si no se encuentra la genero, se devuelve una respuesta de error
            return res.status(404).json({ mensaje: 'Género no encontrado' });
        }

        // Verificar si ya existe una genero con el mismo nombre
        const generoExistente = await Genero.findOne({ nombre: req.body.nombre });
        if (generoExistente && generoExistente._id != id) {
            return res.status(400).json({ mensaje: 'Ya existe un género con el mismo nombre' });
        }

        genero.nombre = req.body.nombre; // Se actualiza el valor del campo 'nombre' de la genero
        genero.estado = req.body.estado; // Se actualiza el valor del campo 'estado' de la genero
        genero.descripcion = req.body.descripcion; // Se actualiza el valor del campo 'descripcion' de la genero
        genero.fechaActualizacion = new Date(); // Se establece la fecha de actualización de la genero

        await genero.save(); // Se guarda la genero actualizada en la base de datos
        res.json(genero); // Se devuelve una respuesta exitosa con los datos de la genero actualizada

    } catch (error) {

        console.log(error); // Si hay un error, se imprime en consola el error
        res.status(500).json({ mensaje: 'Error interno del servidor' }); 

    }
});


// OBTENER TODOS LOS GÉNEROS

router.get('/', async function (req, res) { // Se define la ruta como GET en la URL base /genero

    try {
        const generos = await Genero.find(); // Se buscan todas las generos en la base de datos
        res.json(generos); // Se devuelven las generos encontradas en la base de datos

    } catch (error) {
        console.log(error); // Si hay un error, se imprime en consola el error
        res.status(500).json({ mensaje: 'Error interno del servidor' }); // Si hay un error, se devuelve una respuesta de error con un mensaje
    }

});




// ELIMINAR GÉNERO

router.delete('/:id', async function (req, res) { // Se define la ruta como DELETE en la URL base /genero/:id

    try {
        const { id } = req.params; // Se obtiene el ID de la genero a eliminar
        const genero = await Genero.findByIdAndDelete(id); // Se busca y elimina la genero en la base de datos por su ID

        if (!genero) { // Si no se encuentra la genero, se devuelve una respuesta de error
            return res.status(404).json({ mensaje: 'Género no encontrado' }); // Si no se encuentra la genero, se devuelve una respuesta de error
        }
        res.json(genero); // Si se encuentra la genero, se devuelve una respuesta exitosa con los datos de la genero eliminada

    } catch (error) {
        console.log(error); // Si hay un error, se imprime en consola el error
        res.status(500).json({ mensaje: 'Error interno del servidor o Género no encontrado' }); // Si hay un error, se devuelve una respuesta de error con un mensaje
    }
});







module.exports = router; // Se exporta el enrutador para ser utilizado en otras partes de la aplicación