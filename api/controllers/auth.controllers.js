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

export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password, ...rest } = user._doc;
            return res
                .status(200)
                .cookie("access_token", token, { httpOnly: true })
                .json({
                    success: true,
                    message: "Sign up successfully",
                    data: rest,
                });
        } else {
            const generatedPassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);
            const hashedPassword = bcrpytjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username:
                    name.toLowerCase().split(" ").join("") +
                    Math.random().toString(9).slice(-4),
                email: email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
            });
            const user = await newUser.save();
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password, ...rest } = user._doc;
            return res
                .status(200)
                .cookie("access_token", token, { httpOnly: true })
                .json({
                    success: true,
                    message: "Sign up successfully",
                    data: rest,
                });
        }
    } catch (error) {
        next(error);
    }
};
