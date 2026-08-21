import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const register = async(req, res)=>{
    try{
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.send(400).json({
                message: "All fields are required"
            })
        }
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.send(400).json({
                message: "User is Already exist"
            })
        }

        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create user
        const user = await User.create({
            name, 
            email, 
            password: hashedPassword
        });
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }catch(error){
        console.log("Register Error: ",error.message);
        res.status(500).json({
            message: "Server error"
        })
    }
}

export const login = async(req, res)=>{
    try{

        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
            message: "Email and Password are required"  
            });
        }
        //find user
        const user = await User.findOne({ email })
        if(!user){
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const isPasswordCorrect = bcrypt.compare(password, user.hashedPassword);

        if(!isPasswordCorrect){
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }
        //generate JWT
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,{expiresIn: "7d"}
        );
        res.status(200).json({
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }catch(error){
        console.error("Login Error: ",error.message);

        res.status(500).json({
            message: "Server error"
        })
    }
}


export default register;