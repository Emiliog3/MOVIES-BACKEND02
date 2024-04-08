const { Router } = require('express');                  // Se importa el módulo Router de Express para crear un enrutador

const Productora = require('../models/Productora'); // Se importa el modelo de Productora que representa la estructura de la productora en la base de datos

const { check, validationResult } = require('express-validator'); // Se importan las funciones de validación de express-validator para validar los datos de entrada del usuario

const router = Router();                                // Se crea un nuevo enrutador utilizando el Router de Express

// CREAR PRODUCTORA

router.post('/', [ // Ruta para crear una nueva productora

    check('nombre', 'El nombre es obligatorio').not().isEmpty(), // Se valida que el campo 'nombre' no esté vacío
    check('estado', 'El estado es obligatorio').isIn(['Activo', 'Inactivo']), // Se valida que el campo 'estado' sea uno de los valores permitidos: 'Activo' o 'Inactivo'
    check('slogan', 'El slogan es obligatorio').not().isEmpty(), // Se valida que el campo 'slogan' no esté vacío
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(), // Se valida que el campo 'descripcion' no esté vacío


], async function (req, res) { // Se define la ruta como POST en la URL base /productora
    const errors = validationResult(req); // Se valida si existen errores de validación en la solicitud

    if (!errors.isEmpty()) { // Si hay errores, se devuelve una respuesta de error con los mensajes de error 
        return res.status(400).json({ mensaje: errors.array() }); // Si hay errores, se devuelve una respuesta de error con los mensajes de error
    }

    try {
        // Verificar si ya existe una productora con el mismo nombre
        const productoraExistente = await Productora.findOne({ nombre: req.body.nombre });
        if (productoraExistente) {
            return res.status(400).json({ mensaje: 'Ya existe una productora con el mismo nombre' });
        }

        let productora = new Productora(req.body); // Se crea un nuevo objeto productora con los datos recibidos en la solicitud
        productora.fechaCreacion = new Date(); // Se establece la fecha de creación de la productora
        productora.fechaActualizacion = new Date(); // Se establece la fecha de actualización de la productora

        productora = await productora.save(); // Se guarda la productora en la base de datos
        res.status(201).json(productora); // Se devuelve una respuesta exitosa con los datos de la productora creada
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});


// ACTUALIZAR PRODUCTORA garantizando que no exista en la base de datos una productora con el mismo nombre

router.put('/:id', [ // Ruta para actualizar una productora
    
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), // Se valida que el campo 'nombre' no esté vacío
    check('estado', 'El estado es obligatorio').isIn(['Activo', 'Inactivo']), // Se valida que el campo 'estado' sea uno de los valores permitidos: 'Activo' o 'Inactivo'
    check('slogan', 'El slogan es obligatorio').not().isEmpty(), // Se valida que el campo 'slogan' no esté vacío
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(), // Se valida que el campo 'descripcion' no esté vacío
], async function (req, res) { // Se define la ruta como PUT en la URL base /productora/:id
    const errors = validationResult(req); // Se valida si existen errores de validación en la solicitud

    if (!errors.isEmpty()) { // Si hay errores, se devuelve una respuesta de error con los mensajes de error 
        return res.status(400).json({ mensaje: errors.array() }); // Si hay errores, se devuelve una respuesta de error con los mensajes de error
    }

    try {
        const { id } = req.params; // Se obtiene el ID de la productora a actualizar
        const productora = await Productora.findById(id); // Se busca la productora en la base de datos por su ID

        if (!productora) { // Si la productora no existe, se devuelve una respuesta de error
            return res.status(404).json({ mensaje: 'Productora no encontrada' });
        }

        // Verificar si ya existe una productora con el mismo nombre
        const productoraExistente = await Productora.findOne({ nombre: req.body.nombre });
        if (productoraExistente && productoraExistente._id != id) {
            return res.status(400).json({ mensaje: 'Ya existe una productora con el mismo nombre' });
        }

        productora.set(req.body); // Se actualizan los datos de la productora con los datos recibidos en la solicitud
        productora.fechaActualizacion = new Date(); // Se establece la fecha de actualización de la productora

        await productora.save(); // Se guarda la productora actualizada en la base de datos
        res.json(productora); // Se devuelve una respuesta exitosa con los datos de la productora actualizada
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error interno del servidor o productora no existe' });
    }
});

// OBTENER TODAS LAS PRODUCTORAS

router.get('/', async function (req, res) { // Se define la ruta como GET en la URL base /productora
    try {
        const productoras = await Productora.find(); // Se buscan todas las productoras en la base de datos
        res.json(productoras); // Se devuelven las productoras encontradas
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

// ELIMINAR PRODUCTORA

router.delete('/:id', async function (req, res) {
    try {
        const { id } = req.params;
        const productora = await Productora.findById(id);

        if (!productora) {
            return res.status(404).json({ mensaje: 'Productora no encontrada' });
        }

        await Productora.deleteOne({ _id: id }); // Utilizar deleteOne para eliminar la productora
        res.json({ mensaje: 'Productora eliminada' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error interno del servidor o Productora no encontrada' });
    }
});




module.exports = router; // Se exporta el enrutador para ser utilizado en otras partes de la aplicación