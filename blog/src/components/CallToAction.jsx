import { Button } from "flowbite-react";
const CallToAction = () => {
    return (
        <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
            <div className="flex-1 justify-center flex flex-col">
                <h2 className="text-2xl font-medium">
                    Want to learn HTML, CSS and Javascript by building fin and
                    engaging projects?
                </h2>
                <p className="text-gray-500 my-2">
                    Checkout our 100 js projects website and start building your
                    own projects.
                </p>
                <Button
                    className="rounded-tl-xl rounded-bl-none"
                    gradientDuoTone="purpleToPink"
                >
                    <a
                        href="https://www.100jsprojects.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        100 Javascript Projects
                    </a>
                </Button>
            </div>
            <div className="p-7 flex-1">
                <img src="https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg" />
            </div>
        </div>
    );
};

export default CallToAction;
