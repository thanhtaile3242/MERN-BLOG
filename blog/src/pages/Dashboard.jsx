import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import DashSidebar from "../components/DashSidebar.jsx";
import DashProfile from "../components/DashProfile.jsx";
import DashPost from "../components/DashPost.jsx";
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
                {tab === "posts" && <DashPost />}
            </div>
        </>
    );
};

export default Dashboard;
