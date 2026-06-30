import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    balance: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const Account = mongoose.model("Account", accountSchema);
export default Account;
