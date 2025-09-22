import { Navigate, useLocation } from 'react-router-dom';
import useAdmin from '../Hook/useAdmin';

function AdminRoute({children}) {
    const {user, loading} = useAuth();
    const [isAdmin, isAdminLoading] = useAdmin();
    const location = useLocation();

    if (loading || isAdminLoading) {
        return (
            <div className="w-full flex justify-center items-center py-[400px]">
                <span className="loading loading-spinner loading-xl"></span>
            </div>
        );
    }

    if (user && isAdmin) {
        return children;
    }
    return <Navigate to='/login' state={{ from: location }} replace></Navigate>
}
export default AdminRoute