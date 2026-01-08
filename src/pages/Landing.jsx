import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import Lottie from 'lottie-react'

// Modern Icon Components
const AdminIcon = () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
    </svg>
)

const InstructorIcon = () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
    </svg>
)

const LearnerIcon = () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
)

const BuildingIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
)

const ShieldIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
)

const ChartIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
)

const RoleCard = ({ role, title, description, icon: Icon, lottieUrl, gradientFrom, gradientTo, accentColor, onClick, isSelected, lottieData }) => (
    <div
        onClick={onClick}
        className={`group relative overflow-hidden rounded-3xl p-8 bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl border border-white/50 dark:border-dark-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] cursor-pointer h-full flex flex-col ${isSelected ? 'ring-2 ring-offset-2' : ''}`}
        style={isSelected ? { '--tw-ring-color': accentColor } : {}}
    >
        {/* Gradient overlay on hover */}
        <div
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
            style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
        />

        {/* Lottie Animation or Icon */}
        <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-all duration-500 shadow-lg overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
        >
            {lottieData ? (
                <Lottie
                    animationData={lottieData}
                    loop={true}
                    className="w-14 h-14"
                />
            ) : (
                <div className="text-white">
                    <Icon />
                </div>
            )}
        </div>

        {/* Content */}
        <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-3">
            {title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm leading-relaxed flex-1">
            {description}
        </p>

        {/* CTA */}
        <div
            className="inline-flex items-center gap-2 font-semibold text-sm"
            style={{ color: accentColor }}
        >
            <span>Sign In</span>
            <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
        </div>

        {/* Decorative corner */}
        <div
            className="absolute -bottom-2 -right-2 w-24 h-24 rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500"
            style={{ background: gradientFrom }}
        />
    </div>
)

const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 dark:bg-dark-800/60 backdrop-blur-lg border border-white/30 dark:border-dark-700/30">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-admin-500/20 to-instructor-500/20 flex items-center justify-center flex-shrink-0">
            <div className="text-admin-600 dark:text-admin-400">
                <Icon />
            </div>
        </div>
        <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
    </div>
)

// Demo credentials for each role
const demoCredentials = {
    admin: { email: 'admin@institution.com', password: 'admin123' },
    instructor: { email: 'john@institution.com', password: 'instructor123' },
    learner: { email: 'jane@institution.com', password: 'learner123' },
}

// Lottie animation URLs from LottieFiles CDN
const lottieUrls = {
    admin: 'https://assets2.lottiefiles.com/packages/lf20_v4isjbj5.json', // Dashboard/admin animation
    instructor: 'https://assets5.lottiefiles.com/packages/lf20_t24tpvcu.json', // Teaching/education animation
    learner: 'https://assets2.lottiefiles.com/packages/lf20_xvrofzfk.json', // Learning animation
}

const Landing = () => {
    const { isDark, toggleTheme } = useTheme()
    const { login, isLoading } = useAuth()
    const navigate = useNavigate()

    const [selectedRole, setSelectedRole] = useState(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [lottieData, setLottieData] = useState({})

    // Fetch Lottie animations on mount
    useEffect(() => {
        const fetchLottieData = async () => {
            const data = {}
            for (const [role, url] of Object.entries(lottieUrls)) {
                try {
                    const response = await fetch(url)
                    if (response.ok) {
                        data[role] = await response.json()
                    }
                } catch (err) {
                    console.error(`Failed to load Lottie for ${role}:`, err)
                }
            }
            setLottieData(data)
        }
        fetchLottieData()
    }, [])

    const roles = [
        {
            role: 'admin',
            title: 'Institution Admin',
            description: 'Manage courses, instructors, batches, and monitor overall platform activity and learner enrollments.',
            gradientFrom: '#6366f1',
            gradientTo: '#4338ca',
            accentColor: '#4f46e5',
            icon: AdminIcon,
        },
        {
            role: 'instructor',
            title: 'Instructor',
            description: 'Access assigned courses and batches, upload learning materials, and track learner progress.',
            gradientFrom: '#2dd4bf',
            gradientTo: '#0d9488',
            accentColor: '#0d9488',
            icon: InstructorIcon,
        },
        {
            role: 'learner',
            title: 'Learner',
            description: 'Discover courses, enroll in batches, access learning content, and track your progress.',
            gradientFrom: '#34d399',
            gradientTo: '#059669',
            accentColor: '#059669',
            icon: LearnerIcon,
        },
    ]

    const handleRoleSelect = (role) => {
        setSelectedRole(role)
        setEmail(demoCredentials[role.role].email)
        setPassword(demoCredentials[role.role].password)
        setError('')
    }

    const handleBack = () => {
        setSelectedRole(null)
        setEmail('')
        setPassword('')
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        const result = await login(email, password, selectedRole.role)

        if (result.success) {
            const paths = {
                admin: '/admin',
                instructor: '/instructor',
                learner: '/learner'
            }
            navigate(paths[selectedRole.role])
        } else {
            setError(result.error)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pastel-cream via-white to-pastel-sky dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 overflow-hidden relative">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating orbs */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-admin-400/30 to-admin-600/30 rounded-full blur-3xl animate-float" />
                <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-instructor-400/20 to-instructor-600/20 rounded-full blur-3xl animate-float-delayed" />
                <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-br from-learner-400/25 to-learner-600/25 rounded-full blur-3xl animate-float-slow" />

                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>

            {/* Theme toggle */}
            <div className="absolute top-6 right-6 z-10">
                <button
                    onClick={toggleTheme}
                    className="p-3 rounded-2xl bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all border border-white/50 dark:border-dark-700/50"
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

            <div className="max-w-7xl mx-auto px-6 py-16 relative">
                {/* Hero Section - Only show when no role is selected */}
                {!selectedRole && (
                    <div className="text-center mb-20 animate-fade-in">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl shadow-lg border border-white/50 dark:border-dark-700/50 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-admin-500 via-instructor-500 to-learner-500 flex items-center justify-center shadow-lg">
                                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <span className="text-lg font-display font-semibold text-dark-900 dark:text-white">iLearn</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-dark-900 dark:text-white mb-6 leading-tight">
                            Your Learning
                            <br />
                            <span className="bg-gradient-to-r from-admin-600 via-instructor-500 to-learner-500 bg-clip-text text-transparent animate-gradient">
                                Management Platform
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-dark-500 dark:text-dark-400 max-w-2xl mx-auto leading-relaxed">
                            A lightweight, modern learning management system for training institutions.
                            Manage courses, instructors, and learners all in one place.
                        </p>
                    </div>
                )}

                {/* Role Selection View */}
                {!selectedRole && (
                    <>
                        {/* Role cards */}
                        <div className="grid md:grid-cols-3 gap-8 mb-20 animate-stagger-cards items-stretch">
                            {roles.map((role) => (
                                <RoleCard
                                    key={role.role}
                                    {...role}
                                    lottieData={lottieData[role.role]}
                                    onClick={() => handleRoleSelect(role)}
                                />
                            ))}
                        </div>

                        {/* B2B Enterprise Section */}
                        <div className="mb-20 animate-fade-in">
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-admin-600 via-admin-700 to-instructor-600 p-1">
                                <div className="bg-white/95 dark:bg-dark-900/95 backdrop-blur-xl rounded-[22px] p-8 md:p-12">
                                    <div className="flex flex-col md:flex-row items-center gap-8">
                                        <div className="flex-1">
                                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-admin-100 dark:bg-admin-900/50 text-admin-700 dark:text-admin-300 text-sm font-medium mb-4">
                                                <BuildingIcon />
                                                <span>Enterprise Ready</span>
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-900 dark:text-white mb-4">
                                                Corporate B2B Solutions
                                            </h2>
                                            <p className="text-dark-500 dark:text-dark-400 mb-6 max-w-lg">
                                                Scale your training programs across your organization. Custom branding,
                                                bulk enrollments, dedicated support, and advanced analytics for enterprise clients.
                                            </p>
                                            <div className="flex flex-wrap gap-4">
                                                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-admin-600 to-admin-700 text-white font-semibold hover:shadow-lg hover:shadow-admin-500/30 transition-all transform hover:scale-105">
                                                    Contact Sales
                                                </button>
                                                <button className="px-6 py-3 rounded-xl border-2 border-admin-200 dark:border-admin-700 text-admin-700 dark:text-admin-300 font-semibold hover:bg-admin-50 dark:hover:bg-admin-900/30 transition-all">
                                                    Learn More
                                                </button>
                                            </div>
                                        </div>
                                        <div className="hidden md:block">
                                            <div className="grid grid-cols-2 gap-4">
                                                <FeatureCard
                                                    icon={BuildingIcon}
                                                    title="Custom Branding"
                                                    description="Your logo, your colors"
                                                />
                                                <FeatureCard
                                                    icon={ShieldIcon}
                                                    title="SSO Integration"
                                                    description="Enterprise security"
                                                />
                                                <FeatureCard
                                                    icon={ChartIcon}
                                                    title="Analytics"
                                                    description="Advanced insights"
                                                />
                                                <FeatureCard
                                                    icon={AdminIcon}
                                                    title="Bulk Management"
                                                    description="Scale with ease"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center text-sm text-dark-400">
                            <p>Built for demos, hackathons, and POCs • Modern Learning Experience</p>
                        </div>
                    </>
                )}

                {/* Login View - Split Screen */}
                {selectedRole && (
                    <div className="min-h-[80vh] flex items-center justify-center">
                        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-stretch">
                            {/* Left Panel - Role Info */}
                            <div className="animate-slide-in-left">
                                <div
                                    className="h-full rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden"
                                    style={{ background: `linear-gradient(135deg, ${selectedRole.gradientFrom}, ${selectedRole.gradientTo})` }}
                                >
                                    {/* Decorative elements */}
                                    <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                                    <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

                                    <div className="relative z-10">
                                        <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-8 shadow-lg overflow-hidden">
                                            {lottieData[selectedRole.role] ? (
                                                <Lottie
                                                    animationData={lottieData[selectedRole.role]}
                                                    loop={true}
                                                    className="w-16 h-16"
                                                />
                                            ) : (
                                                <div className="text-white">
                                                    <selectedRole.icon />
                                                </div>
                                            )}
                                        </div>

                                        <h2 className="text-4xl font-display font-bold text-white mb-4">
                                            {selectedRole.title}
                                        </h2>
                                        <p className="text-white/80 text-lg leading-relaxed mb-8">
                                            {selectedRole.description}
                                        </p>

                                        <button
                                            onClick={handleBack}
                                            className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors group"
                                        >
                                            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                            </svg>
                                            <span>Choose different role</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel - Login Form */}
                            <div className="animate-slide-in-right">
                                <div className="h-full bg-white/90 dark:bg-dark-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/50 flex flex-col justify-center">
                                    <div className="mb-8">
                                        <h3 className="text-3xl font-display font-bold text-dark-900 dark:text-white mb-2">
                                            Welcome Back
                                        </h3>
                                        <p className="text-dark-500 dark:text-dark-400">
                                            Sign in to your {selectedRole.title} account
                                        </p>
                                    </div>

                                    {/* Demo credentials notice */}
                                    <div
                                        className="rounded-2xl p-4 mb-6 border"
                                        style={{
                                            backgroundColor: `${selectedRole.gradientFrom}10`,
                                            borderColor: `${selectedRole.gradientFrom}30`
                                        }}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                                style={{ backgroundColor: selectedRole.accentColor }}
                                            >
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium" style={{ color: selectedRole.accentColor }}>Demo Credentials</p>
                                                <p className="text-xs text-dark-500 mt-1">
                                                    Email: {demoCredentials[selectedRole.role].email}<br />
                                                    Password: {demoCredentials[selectedRole.role].password}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form */}
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 focus:outline-none transition-all"
                                                    style={{
                                                        '--tw-ring-color': `${selectedRole.accentColor}40`,
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = selectedRole.accentColor
                                                        e.target.style.boxShadow = `0 0 0 4px ${selectedRole.accentColor}20`
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = ''
                                                        e.target.style.boxShadow = ''
                                                    }}
                                                    placeholder={demoCredentials[selectedRole.role].email}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 focus:outline-none transition-all"
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = selectedRole.accentColor
                                                        e.target.style.boxShadow = `0 0 0 4px ${selectedRole.accentColor}20`
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = ''
                                                        e.target.style.boxShadow = ''
                                                    }}
                                                    placeholder="••••••••"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                                <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full py-4 rounded-xl text-white font-semibold hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed btn-shine"
                                            style={{
                                                background: `linear-gradient(to right, ${selectedRole.gradientFrom}, ${selectedRole.gradientTo})`,
                                                boxShadow: `0 4px 14px 0 ${selectedRole.accentColor}40`
                                            }}
                                        >
                                            {isLoading ? 'Signing in...' : 'Sign In'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Landing
