import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import DashSidebar from "../components/DashSidebar.jsx";
import DashProfile from "../components/DashProfile.jsx";
import DashPosts from "../components/DashPosts.jsx";
import DashUsers from "../components/DashUsers.jsx";
import DashComment from "../components/DashComment.jsx";
import DashBoardComp from "../components/DashBoardComp.jsx";
const Dashboard = () => {
    const location = useLocation();
    const [tab, setTab] = useState("");
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get("tab");
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);
    return (
        <>
            <div className="min-h-screen flex flex-col md:flex-row">
                <div className="md:w-56 ">
                    {/* Sidebar */}
                    <DashSidebar />
                </div>
                {/* profile */}
                {tab === "profile" && <DashProfile />}
                {/* dash-posts */}
                {tab === "posts" && <DashPosts />}
                {/* dash-users */}
                {tab === "users" && <DashUsers />}
                {/* comments */}
                {tab === "comment" && <DashComment />}
                {/* Dash board component */}
                {tab === "dash" && <DashBoardComp />}
            </div>
        </>
    );
};

export default Dashboard;
