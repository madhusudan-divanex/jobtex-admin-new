import jwt from 'jsonwebtoken';
import User from '../models/employee/User.js';

async function adminLoginController(req, res) {
    console.log("called", req.body);
    const { email, password } = req.body;

    try {
       
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            
            jwt.sign({ email: email }, process.env.SECRET_KEY, { expiresIn: '1d' }, (err, token) => {
                if (err) {
                    return res.status(500).json({ message: 'Error in token generation', success: false });
                }
                return res.status(200).json({ token, message: "Login successful", success: true });
            });
        } else {
           
            return res.status(401).json({ message: "Invalid email or password", success: false });
        }
    } catch (error) {
        
        return res.status(500).json({ message: error.message, success: false });
    }
}

async function getEmployeeAllController(req, res) {
  
    try {
        const allEmployees=await User.find();
       
        if (allEmployees.length >0) {
            return res.status(200).json({ employees:allEmployees, message: "Employee Fetched", success: true });
           
        } else {
           
            return res.status(401).json({ message: "no Employee found", success: false });
        }
    } catch (error) {
        
        return res.status(500).json({ message: error.message, success: false });
    }
}

export { adminLoginController ,getEmployeeAllController};
