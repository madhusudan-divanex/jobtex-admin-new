import http from "http"
import nodemailer from "nodemailer";

const verificationMail = async (email,res) => {
   
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
            pass: "bfcnesqpihgyykxo"
        }
    });

    const mailOptions = {
        from: "rawa@gmail.com",
        to: email,
        subject: "You Make Signup On Jobtex  Mail",
        text: `Hello,  this is verification email for your jobtex account click below link to veirfy https://localhost:7000`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return  "Failed to send email"
        }
        return "Email sent successfully!" 
    });
};


export {verificationMail}