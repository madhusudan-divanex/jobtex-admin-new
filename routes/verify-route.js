import express from 'express'
import jwt from 'jsonwebtoken'
const verifyToken =express.Router()
verifyToken.post("/verify-token", (req, res) => {
    const token=req.header('Token')

    if (!token) {
        return res.status(401).json({ valid: false, message: "No token provided" });
    }
 try {
    const decodeUser=jwt.verify(token,process.env.SECRET_KEY)
    req.user=decodeUser
    return res.status(200).json({ valid: true, user: decodeUser,success:true });
 } catch (error) {
    return res.status(500).json({ message:error.message,success:false });
 }


});

export {verifyToken}
// import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ element: Element }) => {
   
//     const [isAuthenticated, setIsAuthenticated] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const base_url = 'http://localhost:7000';
//     useEffect(() => {
//         const verifyToken = async () => {
//             try {
//                 const token = localStorage.getItem("token");
//                 if (!token) {
//                     setIsAuthenticated(false);
//                     setLoading(false);
//                     return;
//                 }

//                 const response = await fetch(`${base_url}/verify-token`,{
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         Token:token,
//                     },
//                 });

//                 const data = await response.json();
//                 if (data.success) {
//                     setIsAuthenticated(true);
//                 } else {
//                     console.log(data)
//                     setIsAuthenticated(false);
//                     localStorage.removeItem("token"); 
//                 }
//             } catch (error) {
//                 setIsAuthenticated(false);
//             }
//             setLoading(false);
//         };

//         verifyToken();
//     }, []);
//     return isAuthenticated ? <Element /> : <Navigate to="/" replace />;
// };

// export default ProtectedRoute;
