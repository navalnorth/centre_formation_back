const mysql = require("mysql2/promise");
require("dotenv").config();

let pool;

const connectToDb = async () => {
  try {
    if (!pool) {
      pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 3306,
        waitForConnections: true,
        connectionLimit: 10, // Limite de connexions simultanées
        queueLimit: 0, // Pas de limite pour les connexions en attente
      });
      console.log("Pool de connexions initialisé");
    }
    const connection = await pool.getConnection();
    console.log("Connexion à la base de données réussie");
    return connection;
  } catch (error) {
    console.error("Erreur lors de la connexion au pool :", error);
    throw error;
  }
};

module.exports = connectToDb;
