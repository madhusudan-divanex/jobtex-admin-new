import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directories exist
const profileDir = "uploads/userphoto/";


if (!fs.existsSync(profileDir)) {
    fs.mkdirSync(profileDir, { recursive: true });
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "profile_url") {
            cb(null, profileDir); 
        } 
        else {
            cb(new Error("Invalid file field"), null);
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

export const userPhoto = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
}).fields([
    {name:"profile_url",maxCount:1}
]); 