import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated } = useAuth()
    const location = useLocation()

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to user's appropriate dashboard
        const dashboards = {
            admin: '/admin',
            instructor: '/instructor',
            learner: '/learner',
        }
        return <Navigate to={dashboards[user.role]} replace />
    }

    return children
}

export default ProtectedRoute
