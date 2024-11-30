const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
require("dotenv").config();
const connectToDb = require("../db.js");



router.get("/:id_formation", async (req, res) => {
    try {
        const db = await connectToDb();
        if (!db) { return res.status(500).json({ message: "Erreur de connexion à la base de données" }) }

        const formationId = req.params.id_formation;

        const sql = "SELECT * FROM formation WHERE id_formation = ?";
        const [results] = await db.query(sql,[formationId]);

        res.status(200).json({ message: "Données récupérées avec succès !", data: results[0] });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des données", error: err.message });
    }
});



router.put("/modifierFormation/:id_formation", async (req, res) => {
    const {title_formation, description_formation, title_formation_page, image_formation, text_button, description_formation_card } = req.body;
    if (!title_formation || !description_formation || !title_formation_page || !text_button || !description_formation_card) { 
        return res.status(400).json({ message: 'Tous les champs sont requis.' }) 
    }

    try {
        const db = await connectToDb();
        if (!db) { return res.status(500).json({ message: "Erreur de connexion à la base de données" }) }

        const formationId = req.params.id_formation;

        const sql = 
        `UPDATE formation SET 
        title_formation = ?, description_formation = ? , title_formation_page = ?, image_formation = ? , text_button = ?  , description_formation_card = ? 
        WHERE id_formation = ?`;
        const [result] = await db.query(sql, [title_formation, description_formation, title_formation_page, image_formation, text_button, description_formation_card, formationId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Aucune ligne trouvée pour mise à jour." });
        }

        res.status(200).json({ message: "Formtion mis à jour avec succès !" });
    } catch (err) {
        res.status(500).json("Erreur lors de la mise à jour de la formation :", err);
    }
});
  



module.exports = router;
