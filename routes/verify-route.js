import express from 'express'
import jwt from 'jsonwebtoken'
const verifyToken =express.Router()
verifyToken.get("/verify-token", (req, res) => {
    const token=req.header('Token')

    if (!token) {
        return res.status(401).json({ valid: false, message: "No token provided" });
    }
 try {
    const decodeUser=jwt.verify(token,process.env.SECRET_KEY)
    req.user=decodeUser
    return res.status(200).json({ valid: true, user: decodeUser,success:true });
 } catch (error) {
   console.log(error)
    return res.status(500).json({ message:error.message,success:false });
 }


});

export {verifyToken}
