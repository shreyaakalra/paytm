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
    
});

accountRouter.post('/transfer', authMiddleware, async(req, res) => {

    const session = await mongoose.startSession();
    
    session.startTransaction();

    try{
        const { to, amount } = req.body;
        const fromUserID = req.userId;

        if(!to || !amount || amount<=0){
            await session.abortTransaction();
            return res.status(400).json({
                message: "Please provide a valid to and amount."
            });
        }

        if(to == fromUserID){
            await session.abortTransaction();
            return res.status(400).json({
                message: "bruh you can't send money to yourself."
            });
        }

        const fromAccount = await accountSchema.findOne({userId: fromUserID}).session(session);

        if(!fromAccount || fromAccount.balance < amount){
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance."
            });
        }

        const toAccount = await accountSchema.findOne({userId: to}).session(session);

        if(!toAccount){
            await session.abortTransaction();
            return res.status(400).json({
                message: "Receiver account doesn't exist."
            });
        }

        await accountSchema.updateOne({userId: fromUserID},{
            $inc : { balance: -amount }
        }).session(session);

        await accountSchema.updateOne({ userId: to}, {
            $inc: { balance: +amount }
        }).session(session);

        await session.commitTransaction();

        res.status(200).json({
            message: "Transaction successful"
        });

    } catch(err){
        await session.abortTransaction();
        console.log(err.message);
        return res.status(500).json({
            message: "Internal Server Error"
        });

    } finally {
        session.endSession();
    }





})

export default accountRouter;