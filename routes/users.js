const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mysql = require("mysql2");
require("dotenv").config();
const connectToDb = require("../db.js");
const jwt = require("jsonwebtoken");



router.post("/login", async (req, res) => {
    const { mail, password } = req.body;
    if (!mail || !password) { return res.status(400).json({ message: "Nom d'utilisateur et mot de passe sont requis." }) }
  
    try {
      const db = await connectToDb();
      if (!db) {
        return res.status(500).json({ message: "Erreur de connexion à la base de données" });
      }
  
      const sql = "SELECT * FROM users WHERE mail = ?";
      const [results] = await db.query(sql, [mail]);
  
      if (!results || results.length === 0) {
        return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
      }
  
      const user = results[0];
    //   const isMatch = await bcrypt.compare(password, user.password);
  
    //   if (!isMatch) {
    //     return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
    //   }
  
      const token = jwt.sign(
        { id: user.id, mail: user.mail },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
  
      res.status(200).json({ message: "Utilisateur connecté", token });
    } catch (err) {
      console.error("Erreur lors de la connexion :", err);
      res.status(500).json({ message: "Erreur lors de la connexion.", error: err.message });
    }
  });



router.put("/modifierProfile/:id_user", async (req, res) => {
    const { mail, password } = req.body;
    if (!mail || !password) { return res.status(400).json({ message: 'Email et motde passe sont requis.' }) }

    try {
        const db = await connectToDb();
        if (!db) { return res.status(500).json({ message: "Erreur de connexion à la base de données" }) }

        const userId = req.params.id_user;

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "UPDATE users SET mail = ?, password = ? WHERE id_user = ?";
        await db.query(sql, [mail, hashedPassword, userId]);

        res.status(200).json({ message: "Profil mis à jour avec succès !" });
    } catch (err) {
        res.status(500).json("Erreur lors de la mise à jour du profil :", err);
    }
});
  



module.exports = router;
