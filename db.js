const mysql = require('mysql2/promise');
require('dotenv').config();

let db = null;

const connectToDb = async () => {
    const timeStamp = new Date();
    const timeOnly = timeStamp.toLocaleTimeString(); // Format par défaut

    if (db) {
        console.log(timeOnly, 'Connecté à la base de données');
        return db;
    }

    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_NAME,
            // password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT || 3306,
        });

        console.log(timeOnly, 'Connection à la BDD.');
        return db;
    } catch (error) {
        console.error(timeOnly, 'Errur lors de la connexion à la BDD: ', error);
        db = null;
        return null;
    }
};

module.exports = connectToDb;