import { Navigate, useLocation } from 'react-router-dom';
import pb from '../lib/pocketbase';

export default function RequireAuth({ children }: { children: JSX.Element }) {
    const location = useLocation();

    if (!pb.authStore.isValid) {
        return <Navigate to="/connexion" state={{ from: location }} replace />;
    }

    return children;
}
