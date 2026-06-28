import express from "express";
import connectDB from "./db.js"

const app = express();
const port = 3001;

app.use(express.json());

connectDB();

app.listen(port, () => {
    console.log("App is listening at port: 3001");
})







