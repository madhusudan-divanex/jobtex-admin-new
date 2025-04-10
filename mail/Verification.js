import http from "http"
import nodemailer from "nodemailer";
import { base_url } from "../baseUrl.js";

const verificationMail = async (email,user_id) => {
   
    const receiver =email

    if (!receiver) {
        return "User not found" 
    }

    

    const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        port: 465,
        auth: {
            user: "rawamansa@gmail.com",
            pass: "mgbkrjlkhnyugtpl"
        }
    });

    const mailOptions = {
        from: "rawa@gmail.com",
        to: email,
        subject: "You Make Signup On Tailored-jobz  Mail",
        text: `Hello,  this is verification email for your Tailored-jobz account click below link to veirfy ${base_url}/personal-details/${user_id}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return  "Failed to send email"
        }
        return "Email sent successfully!" 
    });
};


export {verificationMail}