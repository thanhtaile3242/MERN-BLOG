import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
const OnlyAdminPrivateRoute = () => {
    const { currentUser } = useSelector((state) => state.user);
    return currentUser && currentUser.data.isAdmin ? (
        <Outlet />
    ) : (
        <Navigate to="/" />
    );
};
export default OnlyAdminPrivateRoute;
