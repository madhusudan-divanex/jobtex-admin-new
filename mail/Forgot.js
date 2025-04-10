import nodemailer from "nodemailer";
import { base_url } from "../baseUrl.js";

const forgotMail = async (email, user_id) => {
    if (!email) {
        return "Email is required";
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            auth: {
                user: "rawamansa@gmail.com",
                pass: "mgbkrjlkhnyugtpl"
            }
        });

        const mailOptions = {
            from: "rawamansa@gmail.com",
            to: email,
            subject: "Forgot Password",
            text: `Hello, click the link below to reset your Jobtex password:\n\n${base_url}/reset-password/${user_id}`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
        return "Email sent successfully!";
    } catch (error) {
        console.error("Error sending email:", error);
        return "Failed to send email";
    }
};

export { forgotMail };

// import http from "http"
// import nodemailer from "nodemailer";

// const forgotMail = async (email,user_id) => {
   
//     const receiver =email

//     if (!receiver) {
//         return  "User not found" ;
//     }

    

//     const transporter = nodemailer.createTransport({
//         service: "gmail",
//         secure: true,
//         port: 465,
//         auth: {
//             user: "rawamansa@gmail.com",
//             pass: "bfcnesqpihgyykxo"
//         }
//     });

//     const mailOptions = {
//         from: "rawamansa@gmail.com",
//         to: email,
//         subject: "Forgot Password",
//         text: `Hello,  click below link to  reset your jobtex password https://localhost:3000/reset-password/${user_id}`
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.log("email not sent")
//             return  "Failed to send email"
//         }
//         console.log("email sent")
//         return "Email sent successfully!" 
//     });
// };


// export {forgotMail}