import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Pages
import Landing from './pages/Landing'
import AdminLogin from './pages/auth/AdminLogin'
import InstructorLogin from './pages/auth/InstructorLogin'
import LearnerLogin from './pages/auth/LearnerLogin'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminCourses from './pages/admin/Courses'
import AdminInstructors from './pages/admin/Instructors'
import AdminBatches from './pages/admin/Batches'
import AdminEnrollments from './pages/admin/Enrollments'

// Instructor Pages
import InstructorDashboard from './pages/instructor/Dashboard'
import InstructorBatches from './pages/instructor/Batches'
import InstructorBatchDetail from './pages/instructor/BatchDetail'
import InstructorMaterials from './pages/instructor/Materials'

// Learner Pages
import LearnerDashboard from './pages/learner/Dashboard'
import LearnerDiscover from './pages/learner/Discover'
import LearnerMyCourses from './pages/learner/MyCourses'
import LearnerCourseDetail from './pages/learner/CourseDetail'
import LearnerCoursePlayer from './pages/learner/CoursePlayer'
import LearnerProgress from './pages/learner/Progress'

// Components
import { ProtectedRoute } from './components/navigation'
import { DashboardLayout } from './components/layouts'

// Admin Layout wrapper
const AdminLayout = () => (
    <ProtectedRoute allowedRoles={['admin']}>
        <DashboardLayout title="Admin Dashboard" />
    </ProtectedRoute>
)

// Instructor Layout wrapper
const InstructorLayout = () => (
    <ProtectedRoute allowedRoles={['instructor']}>
        <DashboardLayout title="Instructor Dashboard" />
    </ProtectedRoute>
)

// Learner Layout wrapper
const LearnerLayout = () => (
    <ProtectedRoute allowedRoles={['learner']}>
        <DashboardLayout title="Learner Dashboard" />
    </ProtectedRoute>
)

function App() {
    const { isAuthenticated, user } = useAuth()

    // Redirect authenticated users to their dashboard
    const getHomeRedirect = () => {
        if (!isAuthenticated) return <Landing />
        const paths = {
            admin: '/admin',
            instructor: '/instructor',
            learner: '/learner'
        }
        return <Navigate to={paths[user.role]} replace />
    }

    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={getHomeRedirect()} />
            <Route path="/login/admin" element={<AdminLogin />} />
            <Route path="/login/instructor" element={<InstructorLogin />} />
            <Route path="/login/learner" element={<LearnerLogin />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="instructors" element={<AdminInstructors />} />
                <Route path="batches" element={<AdminBatches />} />
                <Route path="enrollments" element={<AdminEnrollments />} />
            </Route>

            {/* Instructor routes */}
            <Route path="/instructor" element={<InstructorLayout />}>
                <Route index element={<InstructorDashboard />} />
                <Route path="batches" element={<InstructorBatches />} />
                <Route path="batches/:batchId" element={<InstructorBatchDetail />} />
                <Route path="materials" element={<InstructorMaterials />} />
            </Route>

            {/* Learner routes */}
            <Route path="/learner" element={<LearnerLayout />}>
                <Route index element={<LearnerDashboard />} />
                <Route path="discover" element={<LearnerDiscover />} />
                <Route path="my-courses" element={<LearnerMyCourses />} />
                <Route path="course/:courseId" element={<LearnerCourseDetail />} />
                <Route path="course/:courseId/batch/:batchId" element={<LearnerCoursePlayer />} />
                <Route path="progress" element={<LearnerProgress />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default App
