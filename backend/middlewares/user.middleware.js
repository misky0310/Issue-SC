import jwt from "jsonwebtoken";
import User from "../models/users";

export const authenticateJWT = async (req,res,next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader || !authHeader.startsWith("Bearer "))
        return res.status(401).json({ message: "Authorization token missing" });

    const token = authHeader.split(" ")[1];

    try {
        
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(payload.userId).select("-password");
        if(!user)
            return res.status(401).json({ message: "User doesn't exist" });

        req.user = user; // Attach user to request object
        next();

    } catch (error) {
        return res.status(401).json({ message: "Invalid/Expired token", error: error.message });
    }
}

export const authorizeRoles = (...roles) => {
    return (req,res,next) => {
        if(!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        if(!roles.includes(req.user.role))
            return res.status(403).json({ message: "Access denied: Insufficient permissions" });
        next();
    }
}