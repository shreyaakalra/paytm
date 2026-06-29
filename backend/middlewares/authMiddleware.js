import jwt from "jsonwebtoken";
import "dotenv/config";

export default function authMiddleware(req, res, next){
    
    try{
        const token = req.header.authorization.split(" ")[1];

        if(!token){
            return res.status(400).json({
                message: "no token recieved."
            })
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);

        if(!verified){
            return res.status(403).json({
                message: "Invalid token."
            })
        }

        req.userId = verified.id;
        next();
    }

    catch(err){
        console.log(err.message);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
    
}