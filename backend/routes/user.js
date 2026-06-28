import express from "express";
import { userValidator } from "../validators.js";
import userSchema from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const userRouter = express.Router();

userRouter.post('/sign-up', async (req, res) => {
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

export default userRouter;