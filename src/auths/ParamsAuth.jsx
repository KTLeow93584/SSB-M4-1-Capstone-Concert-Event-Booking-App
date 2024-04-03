import { Navigate, useLocation } from 'react-router-dom';

export default function RequireAuth({ children }) {
    const location = useLocation();

    if (location.state) {
        const { event } = location.state;

        // Debug
        //console.log("[Page Authentication - Event Parameter Required] Event.", event);

        if (!event)
            return <Navigate to="/dashboard" replace />;
    }
    else
        return <Navigate to="/dashboard" replace />;

    return children;
}