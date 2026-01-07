import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button, Input } from '../../components/common'

const AdminLogin = () => {
    const navigate = useNavigate()
    const { login, isLoading } = useAuth()
    const [email, setEmail] = useState('admin@institution.com')
    const [password, setPassword] = useState('admin123')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        const result = await login(email, password, 'admin')

        if (result.success) {
            navigate('/admin')
        } else {
            setError(result.error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-admin-600 via-admin-500 to-indigo-400 animate-gradient-bg" />

            {/* Floating orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-admin-300/30 rounded-full blur-3xl animate-float-delayed" />
                <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-indigo-300/20 rounded-full blur-2xl animate-float-slow" />
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3rem_3rem]" />

            <div className="w-full max-w-md mx-6 relative z-10">
                {/* Glass card */}
                <div className="bg-white/90 dark:bg-dark-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/50">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-block mb-6 group">
                            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-admin-500 to-admin-700 flex items-center justify-center shadow-lg shadow-admin-500/30 transform group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                                </svg>
                            </div>
                        </Link>
                        <h1 className="text-3xl font-display font-bold text-dark-900 dark:text-white mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-dark-500 dark:text-dark-400">
                            Sign in to the Admin Dashboard
                        </p>
                    </div>

                    {/* Demo credentials notice */}
                    <div className="bg-gradient-to-r from-admin-50 to-indigo-50 dark:from-admin-900/30 dark:to-indigo-900/30 rounded-2xl p-4 mb-6 border border-admin-100 dark:border-admin-800">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-admin-500 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-admin-700 dark:text-admin-300">Demo Credentials</p>
                                <p className="text-xs text-admin-600 dark:text-admin-400 mt-1">
                                    Email: admin@institution.com<br />
                                    Password: admin123
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
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 focus:outline-none focus:border-admin-500 focus:ring-4 focus:ring-admin-500/20 transition-all"
                                    placeholder="admin@institution.com"
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
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 focus:outline-none focus:border-admin-500 focus:ring-4 focus:ring-admin-500/20 transition-all"
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
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-admin-600 to-admin-700 text-white font-semibold hover:shadow-lg hover:shadow-admin-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed btn-shine"
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Back link */}
                    <div className="mt-8 text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm text-dark-500 hover:text-admin-600 dark:text-dark-400 dark:hover:text-admin-400 transition-colors group"
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

export default AdminLogin
