import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Card, Badge, EmptyState } from '../../components/common'
import enrollmentsData from '../../data/enrollments.json'
import batchesData from '../../data/batches.json'
import coursesData from '../../data/courses.json'

const LearnerDashboard = () => {
    const { user } = useAuth()
    const [enrollments, setEnrollments] = useState([])
    const [batches, setBatches] = useState([])
    const [courses, setCourses] = useState([])

    useEffect(() => {
        const allEnrollments = JSON.parse(localStorage.getItem('enrollments')) || enrollmentsData
        const myEnrollments = allEnrollments.filter(e => e.learnerId === user.id)
        setEnrollments(myEnrollments)
        setBatches(JSON.parse(localStorage.getItem('batches')) || batchesData)
        setCourses(JSON.parse(localStorage.getItem('courses')) || coursesData)
    }, [user.id])

    // Stats
    const completedCourses = enrollments.filter(e => e.progress.status === 'completed').length
    const inProgressCourses = enrollments.filter(e => e.progress.status === 'in-progress').length
    const totalSessions = enrollments.reduce((acc, enrollment) => {
        const batch = batches.find(b => b.id === enrollment.batchId)
        return acc + (batch?.sessions?.length || 0)
    }, 0)
    const completedSessions = enrollments.reduce((acc, enrollment) => {
        return acc + enrollment.progress.completedSessions.length
    }, 0)

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome */}
            <div className="bg-gradient-to-br from-learner-400 to-learner-600 rounded-2xl p-8 text-white">
                <h1 className="text-2xl font-display font-bold mb-2">
                    Welcome back, {user.name}!
                </h1>
                <p className="text-learner-100">
                    Continue your learning journey. You have {inProgressCourses} courses in progress.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-learner-100 dark:bg-learner-900/50 flex items-center justify-center">
                            <svg className="w-6 h-6 text-learner-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-dark-900 dark:text-white">{enrollments.length}</p>
                            <p className="text-sm text-dark-500">Enrolled Courses</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-dark-900 dark:text-white">{inProgressCourses}</p>
                            <p className="text-sm text-dark-500">In Progress</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-dark-900 dark:text-white">{completedCourses}</p>
                            <p className="text-sm text-dark-500">Completed</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-instructor-100 dark:bg-instructor-900/50 flex items-center justify-center">
                            <svg className="w-6 h-6 text-instructor-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-dark-900 dark:text-white">{completedSessions}/{totalSessions}</p>
                            <p className="text-sm text-dark-500">Sessions Done</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Continue Learning */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-dark-900 dark:text-white">
                        Continue Learning
                    </h3>
                    <Link to="/learner/my-courses" className="text-sm text-learner-600 hover:text-learner-700">
                        View all
                    </Link>
                </div>

                {enrollments.filter(e => e.progress.status !== 'completed').length === 0 ? (
                    <EmptyState
                        title="No courses in progress"
                        description="Discover new courses to start learning"
                        action={<Link to="/learner/discover" className="btn-primary px-4 py-2 rounded-xl">Browse Courses</Link>}
                    />
                ) : (
                    <div className="space-y-4">
                        {enrollments
                            .filter(e => e.progress.status !== 'completed')
                            .slice(0, 3)
                            .map((enrollment) => {
                                const course = courses.find(c => c.id === enrollment.courseId)
                                const batch = batches.find(b => b.id === enrollment.batchId)
                                const totalBatchSessions = batch?.sessions?.length || 0
                                const completedBatchSessions = enrollment.progress.completedSessions.length
                                const progress = totalBatchSessions > 0 ? Math.round((completedBatchSessions / totalBatchSessions) * 100) : 0

                                return (
                                    <Link
                                        key={enrollment.id}
                                        to={`/learner/course/${course?.id}/batch/${batch?.id}`}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-dark-50 dark:bg-dark-700/50 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
                                    >
                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-learner-400 to-learner-600 flex items-center justify-center text-white text-2xl font-bold">
                                            {course?.title?.charAt(0) || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-dark-900 dark:text-white truncate">
                                                {course?.title || 'Unknown Course'}
                                            </p>
                                            <p className="text-sm text-dark-500 truncate">
                                                {batch?.name}
                                            </p>
                                            <div className="mt-2 flex items-center gap-3">
                                                <div className="flex-1 h-2 bg-dark-200 dark:bg-dark-600 rounded-full overflow-hidden max-w-[200px]">
                                                    <div
                                                        className="h-full bg-learner-500 rounded-full transition-all"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-dark-500">{progress}%</span>
                                            </div>
                                        </div>
                                        <svg className="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                )
                            })}
                    </div>
                )}
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/learner/discover">
                    <Card className="p-6 hover:shadow-card-hover transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-learner-100 dark:bg-learner-900/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-learner-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-dark-900 dark:text-white">Discover Courses</p>
                                <p className="text-sm text-dark-500">Browse available courses</p>
                            </div>
                        </div>
                    </Card>
                </Link>

                <Link to="/learner/progress">
                    <Card className="p-6 hover:shadow-card-hover transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-dark-900 dark:text-white">View Progress</p>
                                <p className="text-sm text-dark-500">Track your learning journey</p>
                            </div>
                        </div>
                    </Card>
                </Link>
            </div>
        </div>
    )
}

export default LearnerDashboard
