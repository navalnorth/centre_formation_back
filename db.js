const mysql = require('mysql2/promise');
require('dotenv').config();

let db = null; // Connexion partagée
let isReconnecting = false; // Évite plusieurs tentatives simultanées

const connectToDb = async () => {
    const timeStamp = new Date();
    const timeOnly = timeStamp.toLocaleTimeString();

    const isProduction = process.env.NODE_ENV === 'production';

    // Si la connexion existe déjà, la retourner
    if (db && db.connectionState !== 'disconnected') {
        console.log(timeOnly, `Connecté à la base de données (${isProduction ? 'Production' : 'Développement'})`);
        return db;
    }

    // Tenter de se connecter/reconnecter
    try {
        db = await mysql.createConnection({
            host: isProduction ? process.env.PROD_DB_HOST : process.env.DB_HOST,
            user: isProduction ? process.env.PROD_DB_USER : process.env.DB_USER,
            database: isProduction ? process.env.PROD_DB_NAME : process.env.DB_NAME,
            password: isProduction ? process.env.PROD_DB_PASSWORD : process.env.DB_PASSWORD,
            port: isProduction ? process.env.PROD_DB_PORT : process.env.DB_PORT || 3306,
        });

        console.log(timeOnly, `Connexion réussie à la base de données en mode ${isProduction ? 'Production' : 'Développement'}`);

        // Gérer les erreurs de connexion et déconnexion
        db.on('error', async (err) => {
            console.error(`${timeOnly} - Erreur MySQL : ${err.code}`);
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.log(`${timeOnly} - Tentative de reconnexion à la base de données...`);
                await reconnectToDb();
            } else {
                console.error(`${timeOnly} - Erreur non récupérable :`, err.message);
            }
        });

        return db;
    } catch (error) {
        console.error(`${timeOnly} - Impossible de se connecter à la base de données (${isProduction ? 'Production' : 'Développement'}).`);
        console.error('Détails de l\'erreur :', error.message);
        db = null;
        return null;
    }
};

// Fonction de reconnexion automatique
const reconnectToDb = async () => {
    if (isReconnecting) {
        console.log('Déjà en cours de reconnexion...');
        return;
    }
    isReconnecting = true;

    let attempts = 0;
    const maxAttempts = 5;
    const retryInterval = 5000; // 5 secondes

    while (attempts < maxAttempts) {
        attempts += 1;
        console.log(`Tentative ${attempts}/${maxAttempts} de reconnexion...`);

        try {
            db = await connectToDb();
            if (db) {
                console.log('Reconnexion réussie à la base de données.');
                isReconnecting = false;
                return db;
            }
        } catch (err) {
            console.error(`Erreur lors de la tentative de reconnexion : ${err.message}`);
        }

        // Attendre avant de réessayer
        await new Promise(resolve => setTimeout(resolve, retryInterval));
    }

    console.error('Impossible de se reconnecter à la base de données après plusieurs tentatives.');
    isReconnecting = false;
    db = null;
};

module.exports = connectToDb;
