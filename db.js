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
        console.log(`Tentative de connexion à la base de données en mode ${isProduction ? 'Production' : 'Développement'}`);
        console.log({
            host: isProduction ? process.env.PROD_DB_HOST : process.env.DB_HOST,
            user: isProduction ? process.env.PROD_DB_USER : process.env.DB_USER,
            database: isProduction ? process.env.PROD_DB_NAME : process.env.DB_NAME,
            port: isProduction ? process.env.PROD_DB_PORT : process.env.DB_PORT || 3306,
        });

        db = await mysql.createConnection({
            host: isProduction ? process.env.PROD_DB_HOST : process.env.DB_HOST,
            user: isProduction ? process.env.PROD_DB_USER : process.env.DB_USER,
            database: isProduction ? process.env.PROD_DB_NAME : process.env.DB_NAME,
            password: isProduction ? process.env.PROD_DB_PASSWORD : process.env.DB_PASSWORD,
            port: isProduction ? process.env.PROD_DB_PORT : process.env.DB_PORT || 3306,
        });

        console.log(timeOnly, `Connexion réussie à la base de données en mode ${isProduction ? 'Production' : 'Développement'}`);
        return db;
    } catch (error) {
        console.error(`${timeOnly} - Impossible de se connecter à la base de données (${isProduction ? 'Production' : 'Développement'}).`);
        console.error('Détails de l\'erreur :', error.message);
        db = null;
        return null;
    }
};

module.exports = connectToDb;
