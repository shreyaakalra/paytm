import express from "express";
import connectDB from "./db.js"
import router from "./routes/index.js"

const app = express();
const port = 3001;

app.use(express.json());
connectDB();

app.use("/api/v1", router);
// how does it work? 
// Browser hits → /api/v1/users
// index.js sees /api/v1 → forwards to router
// router sees /users → runs the function → sends back JSON

app.listen(port, () => {
    console.log("App is listening at port: 3001");
})







