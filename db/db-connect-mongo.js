// Se importa el módulo mongoose para interactuar con la base de datos MongoDB
const mongoose = require('mongoose');

// Función para establecer la conexión a la base de datos MongoDB
const getConnection = async () => {

    try {
        // URL de conexión a la base de datos MongoDB

        const url = 'mongodb+srv://pgomezg3:270591@cluster0.zst3d85.mongodb.net/movies-db?retryWrites=true&w=majority&appName=Cluster0';

        // Se utiliza el método connect() de mongoose para conectarse a la base de datos
        await mongoose.connect(url);

        // Se muestra un mensaje de conexión exitosa si la conexión se establece correctamente
        console.log('Conexión Exitosa');

    } catch (error) {
        // Se maneja cualquier error que ocurra durante la conexión a la base de datos
        console.log(error);
    }

}

// Se exporta la función getConnection para que pueda ser utilizada por otros módulos
module.exports = {
    getConnection,
}
