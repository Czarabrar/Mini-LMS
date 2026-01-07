import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const InstructorLogin = () => {
    const navigate = useNavigate()
    const { login, isLoading } = useAuth()
    const [email, setEmail] = useState('john@institution.com')
    const [password, setPassword] = useState('instructor123')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        const result = await login(email, password, 'instructor')

        if (result.success) {
            navigate('/instructor')
        } else {
            setError(result.error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-instructor-600 via-instructor-500 to-teal-400 animate-gradient-bg" />

            {/* Floating orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-instructor-300/30 rounded-full blur-3xl animate-float-delayed" />
                <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-teal-300/20 rounded-full blur-2xl animate-float-slow" />
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3rem_3rem]" />

            <div className="w-full max-w-md mx-6 relative z-10">
                {/* Glass card */}
                <div className="bg-white/90 dark:bg-dark-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/50">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-block mb-6 group">
                            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-instructor-500 to-instructor-700 flex items-center justify-center shadow-lg shadow-instructor-500/30 transform group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                                </svg>
                            </div>
                        </Link>
                        <h1 className="text-3xl font-display font-bold text-dark-900 dark:text-white mb-2">
                            Instructor Portal
                        </h1>
                        <p className="text-dark-500 dark:text-dark-400">
                            Access your courses and materials
                        </p>
                    </div>

                    {/* Demo credentials notice */}
                    <div className="bg-gradient-to-r from-instructor-50 to-teal-50 dark:from-instructor-900/30 dark:to-teal-900/30 rounded-2xl p-4 mb-6 border border-instructor-100 dark:border-instructor-800">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-instructor-500 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-instructor-700 dark:text-instructor-300">Demo Credentials</p>
                                <p className="text-xs text-instructor-600 dark:text-instructor-400 mt-1">
                                    Email: john@institution.com<br />
                                    Password: instructor123
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
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 focus:outline-none focus:border-instructor-500 focus:ring-4 focus:ring-instructor-500/20 transition-all"
                                    placeholder="instructor@institution.com"
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
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 focus:outline-none focus:border-instructor-500 focus:ring-4 focus:ring-instructor-500/20 transition-all"
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
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-instructor-600 to-instructor-700 text-white font-semibold hover:shadow-lg hover:shadow-instructor-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed btn-shine"
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Back link */}
                    <div className="mt-8 text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm text-dark-500 hover:text-instructor-600 dark:text-dark-400 dark:hover:text-instructor-400 transition-colors group"
                        >
                            <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InstructorLogin
