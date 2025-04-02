import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directories exist
const reportDir = "uploads/report/";


if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "attachment") {
            cb(null, reportDir); 
        } 
        else {
            cb(new Error("Invalid file field"), null);
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

export const report = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
}).fields([
    {name:"attachment",maxCount:1}
]); 