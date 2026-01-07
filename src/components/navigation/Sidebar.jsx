import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Icon components
const DashboardIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
)

const CoursesIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
)

const UsersIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
)

const BatchIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
)

const EnrollmentIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
)

const MaterialsIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
)

const DiscoverIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
)

const ProgressIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
)

const getNavItems = (role) => {
    const items = {
        admin: [
            { path: '/admin', label: 'Dashboard', icon: DashboardIcon, end: true },
            { path: '/admin/courses', label: 'Courses', icon: CoursesIcon },
            { path: '/admin/instructors', label: 'Instructors', icon: UsersIcon },
            { path: '/admin/batches', label: 'Batches', icon: BatchIcon },
            { path: '/admin/enrollments', label: 'Enrollments', icon: EnrollmentIcon },
        ],
        instructor: [
            { path: '/instructor', label: 'Dashboard', icon: DashboardIcon, end: true },
            { path: '/instructor/batches', label: 'My Batches', icon: BatchIcon },
            { path: '/instructor/materials', label: 'Materials', icon: MaterialsIcon },
        ],
        learner: [
            { path: '/learner', label: 'Dashboard', icon: DashboardIcon, end: true },
            { path: '/learner/discover', label: 'Discover', icon: DiscoverIcon },
            { path: '/learner/my-courses', label: 'My Courses', icon: CoursesIcon },
            { path: '/learner/progress', label: 'Progress', icon: ProgressIcon },
        ],
    }
    return items[role] || []
}

const Sidebar = () => {
    const { user } = useAuth()
    const location = useLocation()

    if (!user) return null

    const navItems = getNavItems(user.role)

    const roleColors = {
        admin: 'from-admin-600 to-admin-700',
        instructor: 'from-instructor-500 to-instructor-600',
        learner: 'from-learner-500 to-learner-600',
    }

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white dark:bg-dark-900 border-r border-dark-200 dark:border-dark-700 flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-dark-200 dark:border-dark-700">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${roleColors[user.role]} flex items-center justify-center`}>
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
                <span className="ml-3 text-xl font-display font-semibold text-dark-900 dark:text-white">
                    Mini LMS
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-6">
                <ul className="space-y-2">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                end={item.end}
                                className={({ isActive }) =>
                                    `sidebar-link ${isActive ? 'active' : ''}`
                                }
                            >
                                <item.icon />
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* User info */}
            <div className="p-4 border-t border-dark-200 dark:border-dark-700">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-50 dark:bg-dark-800">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${roleColors[user.role]} flex items-center justify-center text-white font-medium`}>
                        {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-dark-900 dark:text-white truncate">
                            {user.name}
                        </p>
                        <p className="text-xs text-dark-500 dark:text-dark-400 capitalize">
                            {user.role}
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar
