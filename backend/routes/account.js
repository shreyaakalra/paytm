import express from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import accountSchema from "../models/Account.js"

const accountRouter = express.Router();

accountRouter.get('/balance', authMiddleware, async(req, res) => {

    try{
        const userID = req.userId;

        if(!userID){
            return res.status(401).json({
                message: "You're not authorized."
            })
        }

        const account = await accountSchema.findOne({userId: userID});

        if(!account){
            return res.status(400).json({
                message: "No account with this userID exists."
            })
        }

        res.status(200).json({
            balance: account.balance
        });

    } catch(err){
        console.log(err.message);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
    
})

export default accountRouter;