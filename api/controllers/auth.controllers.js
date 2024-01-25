import User from "../models/user.model.js";
import errorHandler from "../utils/error.js";
import bcrpytjs from "bcryptjs";
export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    if (
        !username ||
        !email ||
        !password ||
        username === `` ||
        email === `` ||
        password === ``
    ) {
        next(errorHandler(400, "All fields are required"));
    }
    const hashedPassword = bcrpytjs.hashSync(password, 10);
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });

    try {
        await newUser.save();
        return res.status(200).json({
            success: true,
            message: "Sign up successfully",
        });
    } catch (error) {
        console.error(error);
        next(errorHandler(500, error.message));
    }
};
