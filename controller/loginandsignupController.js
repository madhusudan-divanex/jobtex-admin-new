import User from "../models/employee/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { verificationMail } from "../mail/Verification.js";
import { forgotMail } from "../mail/Forgot.js";
import LoginUser from "../models/employee/ActiveUser.js";
import Education from "../models/employee/Education.js";
import Information from "../models/employee/Information.js";
async function loginController(req, res) {
    const { email, password } = req.body;
    try {
        const existUser = await User.findOne({ email })
        // console.log(existUser)
        if (existUser) {
            if (existUser.isVerify) {
                const isValid = await bcrypt.compare(password, existUser.password)
                // console.log(isValid)
                if (isValid) {
                    await jwt.sign({ existUser }, process.env.SECRET_KEY, { expiresIn: '1d' }, async (err, token) => {
                        if (err) {
                            return res.status(200).json({ message: 'error in token genertaion', success: false })
                        }
                        const findLogin = await LoginUser.find({ user_id: existUser._id })
                        if (findLogin) {
                            await LoginUser.deleteMany({ user_id: existUser._id })
                        }
                        const addLogin = await LoginUser.create({
                            user_id: existUser._id
                        })
                        const isManual = await Education.exists({ user_id: existUser._id }) ? true : false;
                        const isJob = await Information.exists({
                            user_id: existUser._id,
                            job_title: { $ne: [] } ,
                            location: { $ne: [] }
                        }) ? true : false;


                        return res.status(200).json({ token, message: "login success", isManual,isJob, user: existUser, success: true })
                    })
                }
                else {
                    return res.status(400).json({ message: "Password not match", success: false })
                }
            } else {
                return res.status(400).json({ message: "User not found", success: false })
            }
        }
        else {
            return res.status(400).json({ message: "User not found", success: false })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error, success: false })
    }
}
async function signUpController(req, res) {
    const { first_name, last_name, email, signup_location, password } = req.body;
    try {
        const existUser = await User.findOne({ email })
        if (existUser) {
            if (!existUser.isVerify) {
                await User.findOneAndDelete({ email: email })

            }
            else {
                return res.status(200).json({ message: 'user already exist', success: false })
            }
        }
        const hashpassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            first_name,
            last_name,
            email,
            signup_location,
            password: hashpassword
        })
        if (!newUser) {
            return res.status(400).json({ message: "Signup failed", success: false });
        }
        const user_id = newUser._id
        await verificationMail(email, user_id)

        return res.status(200).json({ message: "account created", user: newUser, success: true })

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, success: false });
        }
        console.log(error)
        return res.status(500).json({ message: error, success: false })
    }
}

async function profileVerifyController(req, res) {

    const id = req.params;
    try {

        await verificationMail(id)
        return res.status(200).json({ message: "mail sent", success: true })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error, success: false })
    }
}

async function resetController(req, res) {
    const { user_id, password } = req.body;
    try {
        const existUser = await User.findOne({ _id: user_id })
        if (existUser) {
            const hashpassword = await bcrypt.hash(password, 10)
            existUser.password = hashpassword
            existUser.save()
            return res.status(200).json({ message: "password rest", success: true })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error, success: false })
    }
}
async function forgotController(req, res) {
    console.log(req.body)
    const { email } = req.body;
    try {
        const findUser = await User.findOne({ email })
        const user_id = findUser._id
        await forgotMail(email, user_id)
        return res.status(200).json({ message: "mail sent", success: true })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error, success: false })
    }
}

export { loginController, signUpController, profileVerifyController, forgotController, resetController }