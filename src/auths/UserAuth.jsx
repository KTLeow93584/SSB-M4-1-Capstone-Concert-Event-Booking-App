import { Navigate } from 'react-router-dom';
import { getSessionToken } from "../apis/authApi.jsx";

export default function RequireAuth({ children }) {
    const token = getSessionToken();

    // Debug
    //console.log("[Page Authentication - User Required] Session Token.", token);

    if (!token)
        return <Navigate to="/login" replace />;

    return children;
}