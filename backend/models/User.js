import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxLength: 50,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        maxLength: 50,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true, 
        lowercase: true, 
        minLength: 3,
        maxLength: 30 
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    }
},{
    timestamps: true
})

const User = mongoose.model("User", userSchema);
export default User;