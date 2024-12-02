const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
require("dotenv").config();
const connectToDb = require("../db.js");
const upload = require("../middlewares/multerConfig.js");



router.get("/", async (req, res) => {
    try {
        const db = await connectToDb();
        if (!db) { return res.status(500).json({ message: "Erreur de connexion à la base de données" }) }

        const sql = "SELECT * FROM card";
        const [results] = await db.query(sql);

        res.status(200).json({ message: "Données récupérées avec succès !", data: results });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des données", error: err.message });
    }
});



router.put("/modifierCard/:id_card", upload.single("bgimage"), async (req, res) => {
    const {description, infoBull1, infoBull2, title} = req.body;
    const bgimage = req.file ? req.file.filename : null
    if (!description || !infoBull1 || !infoBull2 || !title || !bgimage) { 
        return res.status(400).json({ message: 'Tous les champs sont requis.' }) 
    }

    try {
        const db = await connectToDb();
        if (!db) { return res.status(500).json({ message: "Erreur de connexion à la base de données" }) }

        const cardId = req.params.id_card;

        const sql = 
        `UPDATE card 
        SET bgimage = ?, description = ?, infoBull1 = ? , infoBull2 = ? , title = ? 
        WHERE id_card = ?`;
        const [result] = await db.query(sql, [bgimage, description, infoBull1, infoBull2, title, cardId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Aucune ligne trouvée pour mise à jour." });
        }

        res.status(200).json({ message: "Card mis à jour avec succès !" });
    } catch (err) {
        res.status(500).json("Erreur lors de la mise à jour de l'accueil :", err);
    }
});
  



module.exports = router;
