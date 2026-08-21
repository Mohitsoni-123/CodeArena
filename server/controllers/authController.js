import User from "../models/User.js";
import bcrypt from "bcryptjs";

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

export default register;