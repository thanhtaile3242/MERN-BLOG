import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsFacebook, BsInstagram, BsGithub } from "react-icons/bs";
import { BiLogoGmail } from "react-icons/bi";
const FooterComponent = () => {
    return (
        <Footer container className="border border-t-8">
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid w-full justify-between sm:flex md:grid-cols-1">
                    <div className="mt-5">
                        <Link
                            to="/"
                            className="self-center whitespace-nowrap text-sm:text-xl font-semibold dark:text-white text-2xl"
                        >
                            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                                Tai's
                            </span>
                            Blog
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
                        <div>
                            <Footer.Title title="About" />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href="http://www.100jsprojects.com"
                                    target="blank"
                                    rel="noopener noreferrer"
                                >
                                    100 JS Projects
                                </Footer.Link>
                                <Footer.Link
                                    href="/about"
                                    target="blank"
                                    rel="noopener noreferrer"
                                >
                                    Tai's Blog
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="Follow us" />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href="https://github.com/thanhtaile3242?tab=projects"
                                    target="blank"
                                    rel="noopener noreferrer"
                                >
                                    Github
                                </Footer.Link>
                                <Footer.Link href="#">Discord</Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="LEGAL" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="#">Privacy</Footer.Link>
                                <Footer.Link href="#">
                                    Term &amp; Conditions
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                <Footer.Divider />
                <div className="w-full sm:flex sm:items-center sm:justify-between">
                    <Footer.Copyright
                        href="#"
                        by="Tai's Blog"
                        year={new Date().getFullYear()}
                    />
                    <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
                        <Footer.Icon href="#" icon={BsFacebook} />
                        <Footer.Icon href="#" icon={BiLogoGmail} />
                        <Footer.Icon href="#" icon={BsInstagram} />
                        <Footer.Icon href="#" icon={BsGithub} />
                    </div>
                </div>
            </div>
        </Footer>
    );
};
export default FooterComponent;
