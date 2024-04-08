const { Router } = require('express');                  // Se importa el módulo Router de Express para crear un enrutador

const Tipo = require('../models/Tipo'); // Se importa el modelo de Tipo que representa la estructura de la tipo en la base de datos

const { check, validationResult } = require('express-validator'); // Se importan las funciones de validación de express-validator para validar los datos de entrada del usuario

const router = Router();                                // Se crea un nuevo enrutador utilizando el Router de Express



// CREAR TIPO

router.post('/', [ // Ruta para crear un nuevo tipo
    
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), // Se valida que el campo 'nombre' no esté vacío
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(), // Se valida que el campo 'descripcion' no esté vacío

], async function (req, res) { // Se define la ruta como POST en la URL base /tipo
        
        try {
            // Se valida si existen errores de validación en la solicitud
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // Si hay errores, se devuelve una respuesta de error con los mensajes de error
            return res.status(400).json({ mensaje: errors.array() });
        }
        // Verificar si ya existe un tipo con el mismo nombre
        const existeTipoPorNombre = await Tipo.findOne({ nombre: req.body.nombre });
        if (existeTipoPorNombre) {
            return res.status(400).json({ mensaje: 'Ya existe un tipo con el mismo nombre' });
        }
            
        let tipo = new Tipo(); // Se crea un nuevo objeto tipo con los datos recibidos en la solicitud
        tipo.nombre = req.body.nombre; // Se asigna el valor del campo 'nombre' del tipo
        tipo.fechaCreacion = req.body.fechaCreacion; // Se asigna el valor del campo 'fechaCreacion' del tipo
        tipo.fechaActualizacion = req.body.fechaActualizacion; // Se asigna el valor del campo 'fechaActualizacion' del tipo
        tipo.descripcion = req.body.descripcion; // Se asigna el valor del campo 'descripcion' del tipo
        tipo.fechaCreacion = new Date(); // Se establece la fecha de creación del tipo
        tipo.fechaActualizacion = new Date(); // Se establece la fecha de actualización del tipo
            
        tipo = await tipo.save(); // Se guarda el tipo en la base de datos
        res.send (tipo); // Se devuelve una respuesta exitosa con el tipo creado
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});


// ACTUALIZAR TIPO garantizando que no exista en la base de datos un tipo con el mismo nombre

router.put('/:id', [ // Ruta para actualizar un tipo
    
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), // Se valida que el campo 'nombre' no esté vacío
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(), // Se valida que el campo 'descripcion' no esté vacío
], async function (req, res) { // Se define la ruta como PUT en la URL base /tipo/:id
    const errors = validationResult(req); // Se valida si existen errores de validación en la solicitud

    if (!errors.isEmpty()) { // Si hay errores, se devuelve una respuesta de error con los mensajes de error 
        return res.status(400).json({ mensaje: errors.array() }); // Si hay errores, se devuelve una respuesta de error con los mensajes de error
    }

    try {
        const { id } = req.params; // Se obtiene el ID del tipo a actualizar
        const tipo = await Tipo.findById(id); // Se busca el tipo en la base de datos por su ID

        if (!tipo) { // Si no se encuentra el tipo, se devuelve una respuesta de error
            return res.status(404).json({ mensaje: 'Tipo no encontrado' });
        }

        // Verificar si ya existe un tipo con el mismo nombre
        const existeTipoPorNombre = await Tipo.findOne({ nombre: req.body.nombre });
        if (existeTipoPorNombre && existeTipoPorNombre._id != id) {
            return res.status(400).json({ mensaje: 'Ya existe un tipo con el mismo nombre' });
        }

        tipo.nombre = req.body.nombre; // Se asigna el valor del campo 'nombre' del tipo
        tipo.fechaActualizacion = new Date(); // Se establece la fecha de actualización del tipo
        tipo.descripcion = req.body.descripcion; // Se asigna el valor del campo 'descripcion' del tipo

        await tipo.save(); // Se guarda el tipo actualizado en la base de datos
        res.json(tipo); // Se devuelve una respuesta exitosa con el tipo actualizado
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

// LISTAR TIPOS

router.get('/', async function (req, res) { // Se define la ruta como GET en la URL base /tipo

    try {
        const tipos = await Tipo.find(); // Se buscan todos los tipos en la base de datos
        res.json(tipos); // Se devuelven los tipos encontrados
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }

});

// ELIMINAR TIPO

router.delete('/:id', async function (req, res) { // Se define la ruta como DELETE en la URL base /tipo/:id
    try {
        const { id } = req.params; // Se obtiene el ID del tipo a eliminar
        const tipo = await Tipo.findById(id); // Se busca el tipo en la base de datos por su ID

        if (!tipo) { // Si no se encuentra el tipo, se devuelve una respuesta de error
            return res.status(404).json({ mensaje: 'Tipo no encontrado' });
        }

        await Tipo.deleteOne({ _id: id });// Se elimina el tipo de la base de datos
        res.json({ mensaje: 'Tipo eliminado' }); // Se devuelve una respuesta exitosa
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'Error interno del servidor o Tipo no encontrado' });
    }
});




// Se exporta el enrutador para que pueda ser utilizado por otros módulos
module.exports = router;

