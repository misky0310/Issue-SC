import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/users.js";

// Register
export const register = async (req,res) => {
    try {
        const {name,email,password,role="faculty",school} = req.body;
        if (!name || !email || !password) 
            return res.status(400).json({ message: "name, email and password required" });

        const existing = await User.findOne({ email });
        if(existing)
            return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            school
        })

        await user.save();
        return res.status(201).json({ message: "User created successfully", user});

    } catch (error) {
        return res.status(500).json({ message: "Server error while registering", error: error.message });        
    }
}

// Login
export const login = async (req,res) => {
    try{
        const {email,password} = req.body;
        if(!email || !password)
            return res.status(400).json({ message: "email and password required" });

        const user = await User.findOne({ email });
        if(!user)
            return res.status(400).json({ message: "Invalid email" });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
            return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { 
                expiresIn: "7d" 
            }
        );

        return res.status(200).json({ message: "Login successful", token, user });

    }
    catch(error){
        return res.status(500).json({ message: "Server error while logging in", error: error.message });        
    }
}

// Get current user
export const getCurrentUser = async (req,res) => {
    try {
        return res.status(200).json({ user: req.user });
    } catch (error) {
        return res.status(500).json({ message: "Server error while fetching current user", error: error.message });
    }
}

// Get all faculties
export const getFaculties = async (req,res) => {
    try {
        const faculties = await User.find({ role: "faculty" }).select("-password");
        return res.status(200).json({message: "Faculties fetched successfully", faculties});

    } catch (error) {
        return res.status(500).json({ message: "Server error while fetching faculties", error: error.message });
    }
}