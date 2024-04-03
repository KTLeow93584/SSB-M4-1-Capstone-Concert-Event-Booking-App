import { Navigate } from 'react-router-dom';
import { getSessionToken } from '../apis/authApi.jsx';

export default function RequireAuth({ children }) {
    const token = getSessionToken();

    // Debug
    //console.log("[Page Authentication - Only Accessible to Guests] Session Token.", token);

    if (token)
        return <Navigate to={"/home"} replace />;

    return children;
}