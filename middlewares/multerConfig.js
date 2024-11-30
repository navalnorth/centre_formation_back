const multer = require("multer");
const path = require("path");

// Configuration de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Dossier où enregistrer les fichiers
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Nom unique avec extension
    }
});

// Filtrer les fichiers (images uniquement)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Seuls les fichiers image sont autorisés"), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
