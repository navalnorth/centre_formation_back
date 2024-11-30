const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mysql = require("mysql2");
require("dotenv").config();
const connectToDb = require("../db.js");
const jwt = require("jsonwebtoken");
const upload = require("../middlewares/multerConfig.js");




router.get("/", async (req, res) => {
  try {
      const db = await connectToDb();
      if (!db) { return res.status(500).json({ message: "Erreur de connexion à la base de données" }) }

      const sql = "SELECT * FROM users"
      const [results] = await db.query(sql);

      res.status(200).json({ message: "Données récupérées avec succès !", data: results});
  } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération des données", error: err.message });
  }
});



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
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
      }
  
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



  router.put("/modifierProfile", upload.fields([{ name: "logo" }, { name: "image" }]), async (req, res) => {
    const { mail, password, title, description, link_reseaux_1, link_reseaux_2, link_reseaux_3 } = req.body;

    const logo = req.files && req.files.logo ? req.files.logo[0].filename : null;
    const image = req.files && req.files.image ? req.files.image[0].filename : null;

    if (!mail || !password || !title || !description || !link_reseaux_1 || !link_reseaux_2 || !link_reseaux_3 || !logo || !image) {
        return res.status(400).json({ message: "Tous les champs, y compris logo et image, sont requis." });
    }

    try {
        const db = await connectToDb();
        if (!db) {
            return res.status(500).json({ message: "Erreur de connexion à la base de données" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = 
          `UPDATE users SET 
          mail = ?, password = ?, title = ?, logo = ?, image = ?, description = ?, link_reseaux_1 = ?, link_reseaux_2 = ?, link_reseaux_3 = ?`;

        const params = [mail, hashedPassword, title, logo, image, description, link_reseaux_1, link_reseaux_2, link_reseaux_3, mail];
        await db.query(sql, params);

        res.status(200).json({ message: "Profil mis à jour avec succès !" });
    } catch (err) {
        console.error("Erreur lors de la mise à jour du profil :", err);
        res.status(500).json({ message: "Erreur lors de la mise à jour du profil.", error: err.message });
    }
});


  



module.exports = router;
