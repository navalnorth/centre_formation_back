const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
require("dotenv").config();
const connectToDb = require("../db.js");



router.get("/", async (req, res) => {
    try {
        const db = await connectToDb();
        if (!db) { return res.status(500).json({ message: "Erreur de connexion à la base de données" }) }

        const sql = "SELECT * FROM bilan";
        const [results] = await db.query(sql);

        res.status(200).json({ message: "Données récupérées avec succès !", data: results });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des données", error: err.message });
    }
});



router.put("/modifierBilan", async (req, res) => {
    const {title_bilan, description_bilan, title_section_bilan, info_bilan_1, info_bilan_2, info_bilan_3, phrase, image_bilan} = req.body;
    if (!title_bilan || !description_bilan || !title_section_bilan || !info_bilan_1 || !info_bilan_2 || !info_bilan_3 || !phrase) { 
        return res.status(400).json({ message: 'Tous les champs sont requis.' }) 
    }

    try {
        const db = await connectToDb();
        if (!db) { return res.status(500).json({ message: "Erreur de connexion à la base de données" }) }

        const sql = 
        `UPDATE bilan SET 
        title_bilan = ?, description_bilan = ?, title_section_bilan = ?, info_bilan_1 = ?, info_bilan_2 = ?, info_bilan_3 = ?, phrase = ?, image_bilan = ?`;
        const [result] = await db.query(sql, [title_bilan, description_bilan, title_section_bilan, info_bilan_1, info_bilan_2, info_bilan_3, phrase, image_bilan]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Aucune ligne trouvée pour mise à jour." });
        }

        res.status(200).json({ message: "Bilan mis à jour avec succès !" });
    } catch (err) {
        res.status(500).json("Erreur lors de la mise à jour de l'accueil :", err);
    }
});
  



module.exports = router;
