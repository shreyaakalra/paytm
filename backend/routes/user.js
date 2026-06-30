import express from "express";
import { userValidator, userUpdateValidator } from "../validators.js";
import userSchema from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import authMiddleware from "../middlewares/authMiddleware.js"

const userRouter = express.Router();

userRouter.post('/sign-up', async(req, res) => {
    try{
        const validated = userValidator.safeParse(req.body);

        if(!validated.success){
            return res.status(400).json({
                message: validated.error
            })
        }

        const {firstName, lastName, email, password} = validated.data;

        const user = await userSchema.findOne({email: email});

        if(user){
            return res.status(400).json({
                message: "User already exists. Try loggin in instead!"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const newUser = await userSchema.create({
            firstName,
            lastName,
            email,
            password: hashedPass
        });

        const token = jwt.sign(
            {id: newUser._id},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );

        res.status(200).json({token});
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({
            "Error": "Internal Server Error"
        });
    }
})

userRouter.post('/sign-in', async(req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message: "Please enter an email and password"
            });
        }

        const user = await userSchema.findOne({email: email});

        if(!user){
            return res.status(401).json({
                message: "User doesn't exist. Please sign up first."
            });
        }

        const checkPass = await bcrypt.compare(password, user.password);

        if(!checkPass){
            return res.status(403).json({
                message: "wrong email or password"
            });
        }

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );

        res.status(200).json({token});
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
    
})

userRouter.put('/', authMiddleware, async(req, res) => {
    try{
        const userID = req.userId;
        const validated = userUpdateValidator.safeParse(req.body);

        if(!validated.success){
            return res.status(401).json({
                message: "user not validated."
            })
        }

        const { firstName, lastName, password } = validated.data;
        
        let updatedData = {};

        if(firstName) updatedData.firstName = firstName;
        if(lastName) updatedData.lastName = lastName;

        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(password, salt);
            updatedData.password = hashedPass;
        }

        const updated = await userSchema.findByIdAndUpdate(userID, {
            $set: updatedData
        });

        if(!updated){
            return res.status(403).json({
                message: "user doesn't exist."
            })
        }

        res.status(200).json({
            message: "Updated Successfully"
        })
    }
    catch(err){
        console.log(err.message);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
    

})

userRouter.get('/bulk', async (req, res) => {
    try{
        const filter = req.query.filter || "";

        const allUsers = await userSchema.find({
            $or: [
                { firstName: { $regex: `^${filter}`, $options: "i" }},
                { lastName: { $regex: `^${filter}`, $options: "i" }}
            ]
        });

        res.status(200).json({
            allUsers: allUsers.map(user => ({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                userID: user._id
            }))
        })
    }
    catch(err){
        console.log(err.message);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }


    
})

export default userRouter;