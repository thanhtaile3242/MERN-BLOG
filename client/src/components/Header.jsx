import { Navbar, TextInput, Button, Dropdown, Avatar } from "flowbite-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice.js";
import { signoutSuccess } from "../redux/user/userSlice.js";
const Header = () => {
    const path = useLocation().pathname;
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const { currentUser } = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.theme);
    const handleSignout = async () => {
        try {
            const res = await fetch("/api/user/signout", {
                method: "POST",
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                dispatch(signoutSuccess());
            }
        } catch (error) {
            console.log(error.message);
        }
    };
    // useEffect(() => {
    //     const urlParams = new URLSearchParams(location.search);
    //     const searchTermFromUrl = urlParams.get("searchTerm");

    //     if (searchTermFromUrl) {
    //         setSearchTerm(searchTermFromUrl);
    //     }
    // }, [location.search]);
    const handleSubmit = (event) => {
        event.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("searchTerm", searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };
    return (
        <>
            <Navbar className="border-b-2">
                <Link
                    to="/"
                    className="self-center whitespace-nowrap text-sm:text-xl font-semibold dark:text-white text-2xl"
                >
                    <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                        Tai's
                    </span>
                    Blog
                </Link>
                <form onSubmit={handleSubmit}>
                    <TextInput
                        value={searchTerm}
                        onChange={(event) => {
                            setSearchTerm(event.target.value);
                        }}
                        type="text"
                        placeholder="Search..."
                        rightIcon={AiOutlineSearch}
                        className="hidden lg:inline"
                    />
                </form>
                <Button className="w-12 h-10 lg:hidden" color="gray" pill>
                    <AiOutlineSearch />
                </Button>
                <div className="flex gap-2 md:order-2">
                    <Button
                        className="w-12 h-10 hidden sm:inline"
                        color="gray"
                        pill
                        onClick={() => {
                            dispatch(toggleTheme());
                        }}
                    >
                        {theme === "light" ? <FaMoon /> : <FaSun />}
                    </Button>
                    {currentUser ? (
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <Avatar
                                    alt="user"
                                    img={currentUser.data.profilePicture}
                                    rounded
                                />
                            }
                        >
                            <Dropdown.Header>
                                <span className="block text-sm font-medium truncate">
                                    {currentUser.data.email}
                                </span>
                            </Dropdown.Header>
                            <Link to={"/dashboard?tab=profile"}>
                                <Dropdown.Item>Profile</Dropdown.Item>
                            </Link>
                            <Dropdown.Item onClick={handleSignout}>
                                Sign out
                            </Dropdown.Item>
                        </Dropdown>
                    ) : (
                        <Link to={"/sign-in"}>
                            <Button gradientDuoTone="purpleToBlue" outline>
                                Sign In
                            </Button>
                        </Link>
                    )}

                    <Navbar.Toggle />
                </div>

                <Navbar.Collapse>
                    <Navbar.Link active={path === "/"} as={"div"}>
                        <Link to="/">Home</Link>
                    </Navbar.Link>
                    <Navbar.Link active={path === "/about"} as={"div"}>
                        <Link to="/about">About</Link>
                    </Navbar.Link>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
};

export default Header;
