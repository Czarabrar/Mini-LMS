import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button, Input, Card } from '../../components/common'

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pastel-cream via-white to-pastel-mint dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 p-6">
            <div className="w-full max-w-md animate-scale-in">
                <Card className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-block mb-6">
                            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-instructor-400 to-instructor-600 flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </div>
                        </Link>
                        <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white mb-2">
                            Instructor Login
                        </h1>
                        <p className="text-dark-500 dark:text-dark-400">
                            Sign in to access your courses
                        </p>
                    </div>

                    {/* Demo credentials notice */}
                    <div className="bg-instructor-50 dark:bg-instructor-900/30 rounded-xl p-4 mb-6">
                        <p className="text-sm text-instructor-700 dark:text-instructor-300">
                            <span className="font-medium">Demo credentials:</span><br />
                            Internal: john@institution.com / instructor123<br />
                            External: emily.ext@lms-platform.com / ext2024
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="instructor@institution.com"
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
                            className="w-full gradient-instructor"
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
                            className="text-sm text-dark-500 hover:text-instructor-600 dark:text-dark-400 dark:hover:text-instructor-400 transition-colors"
                        >
                            ← Back to home
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default InstructorLogin
