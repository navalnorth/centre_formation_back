const mysql = require('mysql2/promise');
require('dotenv').config();

let db = null;

const connectToDb = async () => {
    const timeStamp = new Date();
    const timeOnly = timeStamp.toLocaleTimeString();

    // Détermine l'environnement (par défaut "development" en local)
    const isProduction = process.env.NODE_ENV === 'production';

    if (db) {
        console.log(timeOnly, `Connecté à la base de données (${isProduction ? 'Production' : 'Développement'})`);
        return db;
    }

    try {
        db = await mysql.createConnection({
            host: isProduction ? process.env.PROD_DB_HOST : process.env.DB_HOST,
            user: isProduction ? process.env.PROD_DB_USER : process.env.DB_USER,
            database: isProduction ? process.env.PROD_DB_NAME : process.env.DB_NAME,
            password: isProduction ? process.env.PROD_DB_PASSWORD : process.env.DB_PASSWORD,
            port: process.env.DB_PORT || 3306,
        });

        console.log(timeOnly, `Connexion à la BDD en ${isProduction ? 'Production' : 'Développement'}.`);
        return db;
    } catch (error) {
        console.error(timeOnly, 'Erreur lors de la connexion à la BDD: ', error);
        db = null;
        return null;
    }
};

module.exports = connectToDb;
