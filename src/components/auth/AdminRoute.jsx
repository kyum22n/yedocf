import { Navigate } from "react-router-dom";
import { useUser } from "@/contexts/UserProvider";

const AdminRoute = ({ children }) => {
    const { user, loading } = useUser();

    if (loading) return null;
    if (!user || user.type !== "admin") return <Navigate to="/adminlogin" replace />;

    return children;
};

export default AdminRoute;
