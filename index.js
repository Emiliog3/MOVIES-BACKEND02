// Se importa el módulo express para crear la aplicación web
const express = require('express');

// Se importa la función getConnection del archivo db-connect-mongo.js ubicado en la carpeta db
const { getConnection } = require('./db/db-connect-mongo');

// Se importa el módulo cors para permitir solicitudes desde otros dominios
const cors = require('cors');

// Se importa el módulo dotenv para cargar variables de entorno desde un archivo .env
require('dotenv').config();

// Se crea una instancia de la aplicación express
const app = express();

// Se define el host al que se va a enlazar la aplicación (en este caso, '0.0.0.0' para escuchar en todas las interfaces disponibles)
const host = '0.0.0.0';

// Se obtiene el puerto desde las variables de entorno
const port = process.env.PORT;

// Implementación de CORS para permitir solicitudes desde todos los dominios
app.use(cors());

// Se establece la conexión a la base de datos MongoDB
getConnection();



// Middleware para analizar el cuerpo de las solicitudes entrantes como JSON
app.use(express.json());


// Se define la ruta '/genero' y se usa el enrutador definido en './router/genero' para manejar las solicitudes a esta ruta
app.use('/genero', require('./router/genero'));


// Se define la ruta '/director' y se usa el enrutador definido en './router/director' para manejar las solicitudes a esta ruta
app.use('/director', require('./router/director'));

// Se define la ruta '/productora' y se usa el enrutador definido en './router/productora' para manejar las solicitudes a esta ruta
app.use('/productora', require('./router/productora'));

// Se define la ruta '/tipo' y se usa el enrutador definido en './router/tipo' para manejar las solicitudes a esta ruta
app.use('/tipo', require('./router/tipo'));

// Se define la ruta '/media' y se usa el enrutador definido en './router/media' para manejar las solicitudes a esta ruta
app.use('/media', require('./router/media'));




// La aplicación Express escucha en el puerto definido y enlazada al host especificado
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
