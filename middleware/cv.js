import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directories exist
const cvDir = "uploads/cv/";


if (!fs.existsSync(cvDir)) {
    fs.mkdirSync(cvDir, { recursive: true });
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "cv_file") {
            cb(null, cvDir); 
        } 
        else {
            cb(new Error("Invalid file field"), null);
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

export const CV = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
}).fields([
    {name:"cv_file",maxCount:1}
]); 