import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const RoleCard = ({ role, title, description, icon, gradientStyle, textColor, delay }) => (
    <Link
        to={`/login/${role}`}
        className="group relative overflow-hidden rounded-2xl p-8 bg-white dark:bg-dark-800 border border-gray-100 dark:border-dark-700 shadow-card hover:shadow-card-hover transition-all duration-500 transform hover:-translate-y-1 opacity-100"
        style={{ animationDelay: delay }}
    >
        {/* Icon */}
        <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300"
            style={{ background: gradientStyle }}
        >
            {icon}
        </div>

        {/* Content */}
        <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-2">
            {title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm leading-relaxed">
            {description}
        </p>

        {/* CTA */}
        <div className="inline-flex items-center gap-2 font-medium" style={{ color: textColor }}>
            <span>Sign In</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
        </div>
    </Link>
)

const Landing = () => {
    const { isDark, toggleTheme } = useTheme()

    const roles = [
        {
            role: 'admin',
            title: 'Institution Admin',
            description: 'Manage courses, instructors, batches, and monitor overall platform activity and learner enrollments.',
            gradientStyle: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
            textColor: '#4f46e5',
            icon: (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
        },
        {
            role: 'instructor',
            title: 'Instructor',
            description: 'Access assigned courses and batches, upload learning materials, and track learner progress.',
            gradientStyle: 'linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)',
            textColor: '#0d9488',
            icon: (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
            ),
        },
        {
            role: 'learner',
            title: 'Learner',
            description: 'Discover courses, enroll in batches, access learning content, and track your progress.',
            gradientStyle: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
            textColor: '#059669',
            icon: (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-pastel-cream via-white to-pastel-sky dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
            {/* Theme toggle */}
            <div className="absolute top-6 right-6">
                <button
                    onClick={toggleTheme}
                    className="p-3 rounded-xl bg-white dark:bg-dark-800 shadow-card hover:shadow-card-hover transition-all"
                >
                    {isDark ? (
                        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-dark-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    )}
                </button>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-20">
                {/* Hero */}
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white dark:bg-dark-800 shadow-card mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-admin-500 via-instructor-500 to-learner-500 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <span className="text-lg font-display font-semibold text-dark-900 dark:text-white">Mini LMS</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-dark-900 dark:text-white mb-6 leading-tight">
                        Your Learning<br />
                        <span className="bg-gradient-to-r from-admin-600 via-instructor-500 to-learner-500 bg-clip-text text-transparent">
                            Management Platform
                        </span>
                    </h1>

                    <p className="text-lg text-dark-500 dark:text-dark-400 max-w-2xl mx-auto leading-relaxed">
                        A lightweight, modern learning management system for training institutions.
                        Manage courses, instructors, and learners all in one place.
                    </p>
                </div>

                {/* Role cards */}
                <div className="grid md:grid-cols-3 gap-6 animate-stagger-cards">
                    {roles.map((role) => (
                        <RoleCard key={role.role} {...role} />
                    ))}
                </div>

                {/* Footer */}
                <div className="text-center mt-16 text-sm text-dark-400">
                    <p>Built for demos, hackathons, and POCs</p>
                </div>
            </div>
        </div>
    )
}

export default Landing
