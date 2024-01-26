import { Link, useNavigate } from "react-router-dom";
import { Label, TextInput, Button, Alert, Spinner } from "flowbite-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    signInStart,
    signInSuccess,
    signInFailure,
} from "../redux/user/userSlice.js";
const SignIn = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    // const [errorMessage, setErrorMessage] = useState(null);
    // const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const { loading, error: errorMessage } = useSelector((state) => state.user);
    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.id]: event.target.value.trim(),
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // setIsLoading(true);
        if (!formData.email || !formData.password) {
            // setIsLoading(false);
            // return setErrorMessage("Please fill out all fields.");
            return dispatch(signInFailure("Please fill out all fields"));
        }
        try {
            // setIsLoading(true);
            // setErrorMessage(null);
            dispatch(signInStart());
            const response = await fetch("/api/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (data.success === false) {
                // setIsLoading(false);
                // return setErrorMessage(data.message);
                dispatch(signInFailure(data.message));
            }
            if (data.success) {
                dispatch(signInSuccess(data));
                navigate("/");
            }
            // setIsLoading(false);
        } catch (error) {
            // setErrorMessage(error.message);
            // setIsLoading(false);
            dispatch(signInFailure(error.message));
        }
    };
    return (
        <>
            <div className="min-h-screen mt-20">
                <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
                    {/* Left */}
                    <div className="flex-1">
                        <Link
                            to="/"
                            className="self-center whitespace-nowrap text-sm:text-xl font-semibold dark:text-white text-4xl"
                        >
                            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                                Tai's
                            </span>
                            Blog
                        </Link>
                        <p className="text-sm mt-5">
                            Welcome to our platform, sign up and create your
                            fascinating blogs.
                        </p>
                    </div>
                    {/* Right */}

                    <div className="flex-1">
                        <form
                            className="flex flex-col gap-4"
                            onSubmit={handleSubmit}
                        >
                            <div>
                                <Label value="Your email" />
                                <TextInput
                                    type="email"
                                    placeholder="name@gmail.com"
                                    id="email"
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label value="Your password" />
                                <TextInput
                                    type="password"
                                    placeholder="******"
                                    id="password"
                                    onChange={handleChange}
                                />
                            </div>
                            <Button
                                gradientDuoTone="purpleToPink"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner size="sm" />
                                        <span className="pl-3">
                                            Loading ...
                                        </span>
                                    </>
                                ) : (
                                    "Sgin In"
                                )}
                            </Button>
                        </form>
                        <div className="flex gap-2 text-sm mt-5">
                            <span className="font-semibold">
                                Do not have an account?
                            </span>
                            <Link to="/sign-Up" className="text-blue-500">
                                Sign Up
                            </Link>
                        </div>
                        {errorMessage && (
                            <Alert className="mt-5" color="failure">
                                {errorMessage}
                            </Alert>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignIn;
