import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        profilePicture: {
            type: String,
            default:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGhmTe4FGFtGAgbIwVBxoD3FmED3E5EE99UGPItI0xnQ&s",
        },
    },
    { timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User;
