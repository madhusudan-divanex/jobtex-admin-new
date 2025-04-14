import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directories exist
const companyDir = "uploads/companyphoto/";


if (!fs.existsSync(companyDir)) {
    fs.mkdirSync(companyDir, { recursive: true });
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "company_photo") {
            cb(null, companyDir); 
        } 
        else {
            cb(new Error("Invalid file field"), null);
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

export const companyPhoto = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
}).fields([
    {name:"company_photo",maxCount:1}
]); 