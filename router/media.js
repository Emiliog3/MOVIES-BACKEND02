// routes/media.js
const { Router } = require('express');
const Media = require('../models/Media');
const { check, validationResult } = require('express-validator');
const router = Router();

// CREAR MEDIA
router.post('/', [
    check('serial').notEmpty().withMessage('El serial es obligatorio'),
    check('titulo').notEmpty().withMessage('El título es obligatorio'),
    check('sinopsis').notEmpty().withMessage('La sinopsis es obligatoria'),
    // Se remueve la validación de URL obligatoria para el campo url
    check('url').optional().isURL().withMessage('La URL no es válida'), // La URL ahora es opcional
    check('imagen').notEmpty().withMessage('La imagen es obligatoria'),
    check('anioEstreno').notEmpty().withMessage('El año de estreno es obligatorio'),
    check('genero').notEmpty().withMessage('El género es obligatorio'),
    check('director').notEmpty().withMessage('El director es obligatorio'),
    check('productora').notEmpty().withMessage('La productora es obligatoria'),
    check('tipo').notEmpty().withMessage('El tipo es obligatorio')
], async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const existeMediaPorSerial = await Media.findOne({ serial: req.body.serial });
        if (existeMediaPorSerial) {
            return res.status(400).json({ mensaje: 'Ya existe una media con el mismo serial' });
        }

        let media = new Media(req.body);
        media.fechaCreacion = new Date();
        media.fechaActualizacion = new Date();
        media = await media.save();
        res.send(media);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al crear media');
    }
});

// OBTENER TODAS LAS MEDIAS
router.get('/', async function (req, res) {
    try {
        const medias = await Media.find()
            .populate('genero')
            .populate('director')
            .populate('productora')
            .populate('tipo');
        res.send(medias);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al obtener medias');
    }
});

// ACTUALIZAR MEDIA
router.put('/:id', async function (req, res) {
    try {
        const media = await Media.findById(req.params.id);
        if (!media) {
            return res.status(404).send('No se encontró la media');
        }
        Object.assign(media, req.body);
        media.fechaActualizacion = new Date();
        await media.save();
        res.send(media);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al actualizar media');
    }
});

// ELIMINAR MEDIA
router.delete('/:id', async function (req, res) {
    try {
        const media = await Media.findByIdAndDelete(req.params.id);
        if (!media) {
            return res.status(404).json({ mensaje: 'No se encontró el medio' });
        }
        res.json(media);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor o medio no encontrado' });
    }
});

router.get('/mediaId', async function (req, res) {

    try {
        const media = await Media.findById(req.params.mediaId);
        if (!media) {
            return res.status(404).send('No se encontró la media');
        }
        res.send(media);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al obtener la media');
    }
}
);



module.exports = router;
