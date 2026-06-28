import express from "express";

const userRouter = express.Router();

userRouter.get('/sign-up', (req, res) => {
    try{
        const { firstName, lastName, email, password } = req.body;
    }
    catch(err){
        res.status(500).json({
            "Error": "Internal Server Error"
        })
    }
})

export default userRouter;