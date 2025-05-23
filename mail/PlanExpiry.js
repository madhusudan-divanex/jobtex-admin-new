import http from "http"
import nodemailer from "nodemailer";
import { base_url } from "../baseUrl.js";

const planExpiryMail = async (email) => {
   
    const receiver =email

    if (!receiver) {
        return res.status(404).json({ error: "User not found" });
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
        subject: "Plan expiry alert",
        text: `Hello,  click below link to  reset your jobtex password ${base_url}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ error: "Failed to send email" });
        }
        return res.json({ success: "Email sent successfully!" });
    });
};


export {planExpiryMail}