const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
require("dotenv").config();
const connectToDb = require("../db.js");

// const upload = require("../middlewares/multerConfig.js"); 

// -----Upload
const multer = require('multer')
const path = require('path')

let storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './uploads/')     // './uploads/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

let upload = multer({
    storage: storage
});

// FIN Upload--------------------

router.get("/", async (req, res) => {
    try {
        const db = await connectToDb();
        if (!db) { return res.status(500).json({ message: "Erreur de connexion à la base de données" }) }

        const sql = "SELECT * FROM accueil";
        const [results] = await db.query(sql);

        res.status(200).json({ message: "Données récupérées avec succès !", data: results });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des données", error: err.message });
    }
});



router.put("/modifierAccueil", upload.single("image_accueil"), async (req, res) => {
    const { title_accueil, title_section, name, description } = req.body;
    const image_accueil = req.file ? req.file.filename : null
    if (!title_accueil || !title_section || !name || !description || !image_accueil) { 
        return res.status(400).json({ message: 'Tous les champs sont requis.' }) 
    }

    try {
        const db = await connectToDb();
        if (!db) { return res.status(500).json({ message: "Erreur de connexion à la base de données" }) }

        const sql = 
        `UPDATE accueil SET 
        title_accueil = ?, title_section = ?, image_accueil = ?, name = ?, description = ?`;
        const [result] = await db.query(sql, [title_accueil, title_section, image_accueil, name, description]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Aucune ligne trouvée pour mise à jour." });
        }

        res.status(200).json({ message: "Accueil mis à jour avec succès !" });
    } catch (err) {
        res.status(500).json("Erreur lors de la mise à jour de l'accueil :", err);
    }
});
  

router.put("/modifierAccueilImage", upload.single("image_accueil"), async (req, res) => {
    let image_accueil;

    if (!req.file) {
        image_accueil = ""
    } else {
        console.log(req.file.filename)
        image_accueil = req.file.filename
    }


    try {
        const db = await connectToDb();
        if (!db) { return res.status(500).json({ message: "Erreur de connexion à la base de données" }) }

        const sql = 
        `UPDATE accueil SET 
        image_accueil = ?`;
        const [result] = await db.query(sql, [image_accueil]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Aucune ligne trouvée pour mise à jour." });
        }

        res.status(200).json({ message: "Accueil mis à jour avec succès !" });
    } catch (err) {
        res.status(500).json("Erreur lors de la mise à jour de l'accueil :", err);
    }
});
  




module.exports = router;
