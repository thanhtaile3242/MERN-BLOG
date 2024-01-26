import User from "../models/user.model.js";
import errorHandler from "../utils/error.js";
import dotenv from "dotenv";
import bcrpytjs from "bcryptjs";
import jwt from "jsonwebtoken";
dotenv.config({ path: "../../.env" });
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
        return next(errorHandler(400, "All fields are required"));
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
        return next(errorHandler(500, error.message));
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password || email === "" || password === "") {
        next(errorHandler(400, "All fields are required"));
    }
    try {
        const validUser = await User.findOne({ email: email });
        if (!validUser) {
            return next(errorHandler(400, "User not found"));
        }
        const validPassword = bcrpytjs.compareSync(
            password,
            validUser.password
        );
        if (!validPassword) {
            return next(errorHandler(400, "Invalid password"));
        }
        const token = jwt.sign(
            {
                id: validUser._id,
            },
            process.env.JWT_SECRET
        );
        const data = {
            _id: validUser._id,
            username: validUser.username,
            email: validUser.email,
        };
        return res
            .status(200)
            .cookie("access_token", token, {
                httpOnly: true,
            })
            .json({
                success: true,
                message: "Sign up successfully",
                data: data,
            });
    } catch (error) {
        console.error(error);
        return next(errorHandler(500, error.message));
    }
};
