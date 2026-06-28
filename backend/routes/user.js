import express from "express";
import { userValidator } from "../validators.js";
import userSchema from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

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

export default userRouter;