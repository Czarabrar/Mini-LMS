import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button, Input, Card } from '../../components/common'

const LearnerLogin = () => {
    const navigate = useNavigate()
    const { login, isLoading } = useAuth()
    const [email, setEmail] = useState('jane@institution.com')
    const [password, setPassword] = useState('learner123')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        const result = await login(email, password, 'learner')

        if (result.success) {
            navigate('/learner')
        } else {
            setError(result.error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pastel-cream via-white to-pastel-mint dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 p-6">
            <div className="w-full max-w-md animate-scale-in">
                <Card className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-block mb-6">
                            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-learner-400 to-learner-600 flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                        </Link>
                        <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white mb-2">
                            Learner Login
                        </h1>
                        <p className="text-dark-500 dark:text-dark-400">
                            Sign in to start learning
                        </p>
                    </div>

                    {/* Demo credentials notice */}
                    <div className="bg-learner-50 dark:bg-learner-900/30 rounded-xl p-4 mb-6">
                        <p className="text-sm text-learner-700 dark:text-learner-300">
                            <span className="font-medium">Demo credentials:</span><br />
                            jane@institution.com / learner123<br />
                            alex@institution.com / learner123<br />
                            sam@institution.com / learner123
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Organizational Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@institution.com"
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
                            className="w-full gradient-learner"
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
                            className="text-sm text-dark-500 hover:text-learner-600 dark:text-dark-400 dark:hover:text-learner-400 transition-colors"
                        >
                            ← Back to home
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default LearnerLogin
