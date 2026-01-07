import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button, Input, Card } from '../../components/common'

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pastel-cream via-white to-pastel-lavender dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 p-6">
            <div className="w-full max-w-md animate-scale-in">
                <Card className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-block mb-6">
                            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-admin-500 to-admin-700 flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                        </Link>
                        <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white mb-2">
                            Admin Login
                        </h1>
                        <p className="text-dark-500 dark:text-dark-400">
                            Sign in to manage your institution
                        </p>
                    </div>

                    {/* Demo credentials notice */}
                    <div className="bg-admin-50 dark:bg-admin-900/30 rounded-xl p-4 mb-6">
                        <p className="text-sm text-admin-700 dark:text-admin-300">
                            <span className="font-medium">Demo credentials:</span><br />
                            Email: admin@institution.com<br />
                            Password: admin123
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@institution.com"
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />

                        {error && (
                            <p className="text-sm text-red-500 text-center">{error}</p>
                        )}

                        <Button
                            type="submit"
                            className="w-full gradient-admin"
                            size="lg"
                            loading={isLoading}
                        >
                            Sign In
                        </Button>
                    </form>

                    {/* Back link */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/"
                            className="text-sm text-dark-500 hover:text-admin-600 dark:text-dark-400 dark:hover:text-admin-400 transition-colors"
                        >
                            ← Back to home
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default AdminLogin
