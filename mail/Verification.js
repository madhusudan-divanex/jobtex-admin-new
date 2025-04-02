import http from "http"
import nodemailer from "nodemailer";

const verificationMail = async (email) => {
   
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
            pass: "bfcnesqpihgyykxo"
        }
    });

    const mailOptions = {
        from: "rawa@gmail.com",
        to: email,
        subject: "You Make Signup On Jobtex  Mail",
        text: `Hello,  this is verification email for your jobtex account click below link to veirfy https://localhost:4000`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ error: "Failed to send email" });
        }
        return res.json({ success: "Email sent successfully!" });
    });
};


export {verificationMail}