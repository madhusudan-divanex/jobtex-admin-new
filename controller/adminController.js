import jwt from 'jsonwebtoken';
import User from '../models/employee/User.js';
import Role from '../models/Role.js';

async function adminLoginController(req, res) {
   
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

async function getEmployeePlanController(req, res) {
  
    try {
        const freeEmployees=await User.countDocuments({ plan: 'Free' });
        const standardEmployees=await User.countDocuments({ plan: 'Standard' });
        const ultraEmployees=await User.countDocuments({ plan: 'Pro' });
        const totalUsers=freeEmployees+standardEmployees+ultraEmployees
        // console.log(totalUsers)
       
        
        return res.status(200).json({ freeEmployees,standardEmployees,ultraEmployees,totalUsers, message: "Employee Fetched", success: true });
           
       
    } catch (error) {
        
        return res.status(500).json({ message: error.message, success: false });
    }
}


//          Staff Controller
async function createStaffController(req, res) {
   console.log(req.body)
    const {name,type,email, password ,access} = req.body;

    try {
        const newRole = await Role.find({email})
        if (newRole.length > 0) {
         
            return res.status(500).json({ message: "staff alreay exists", success: false })
        }
        else{
            const newRole = await Role.create({
                name,type, email, password ,access
            })

            if (!newRole) {
                return res.status(500).json({ message: "role creation failed", success: false })
            }
            return res.status(200).json({  message: "role creation success", success: true })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message, success: false })
    }
}

async function getStaffController(req, res) {
  
    try {
        const allStaff=await Role.find();
       
        if (allStaff.length >0) {
            return res.status(200).json({ staff:allStaff, message: "Staff Fetched", success: true });
           
        } else {
           
            return res.status(401).json({ message: "no staff found", success: false });
        }
    } catch (error) {
        
        return res.status(500).json({ message: error.message, success: false });
    }
}

async function getStaffByIdController(req, res) {
  const id=req.params.id
    try {
        const oneStaff=await Role.findOne({_id:id});
       console.log(oneStaff)
        if (oneStaff) {
            return res.status(200).json({ staff:oneStaff, message: "Staff Fetched", success: true });
           
        } else {
           
            return res.status(401).json({ message: "no staff found", success: false });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message, success: false });
    }
}

async function updateStaffController(req, res) {
   const id=req.params.id
    const {staff_id,name,type, email, password ,access} = req.body;

    try {
        const findStaff = await Role.find({_id:id})
        if (findStaff.length > 0) {
            const updateStaff = await Role.findByIdAndUpdate(id,{
                name,type, email, password ,access
            },{new:true})

            if (!updateStaff) {
                return res.status(500).json({ message: "staff updation failed", success: false })
            }
            return res.status(200).json({  message: "staff updated successfully", success: true })
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: error, success: false })
    }
}

async function deleteStaffController(req, res) {
    const  id  = req.params.id;

    try {
        
        const staff = await Role.findById(id);
        
        if (!staff) {
            return res.status(404).json({ message: "Staff not found", success: false });
        }

       
        const isDelete=await Role.findByIdAndDelete(id);
        if(isDelete){
            return res.status(200).json({ message: "staff deleted successfully", success: true });
        }

        return res.status(400).json({ message: "staff deleted successfully", success: false });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message, success: false });
    }
}

export { adminLoginController ,getEmployeeAllController,getEmployeePlanController ,createStaffController,getStaffController,getStaffByIdController,updateStaffController,deleteStaffController};
