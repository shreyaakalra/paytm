import express from "express";
import connectDB from "./db.js";
import router from "./routes/index.js";
import userRouter from "./routes/user.js";
import accountRouter from "./routes/account.js"
import cors from "cors";
import "dotenv/config"

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());
connectDB();

app.use("/api/v1", router);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/account", accountRouter);
// how does it work? 
// Browser hits → /api/v1/users
// index.js sees /api/v1 → forwards to router
// router sees /users → runs the function → sends back JSON

app.listen(port, () => {
    console.log("App is listening at port: http://localhost:5001/");
})







