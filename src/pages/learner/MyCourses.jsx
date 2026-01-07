import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Card, Badge, EmptyState } from '../../components/common'
import enrollmentsData from '../../data/enrollments.json'
import batchesData from '../../data/batches.json'
import coursesData from '../../data/courses.json'

const LearnerMyCourses = () => {
    const { user } = useAuth()
    const [enrollments, setEnrollments] = useState([])
    const [batches, setBatches] = useState([])
    const [courses, setCourses] = useState([])
    const [filterStatus, setFilterStatus] = useState('all')

    useEffect(() => {
        const allEnrollments = JSON.parse(localStorage.getItem('enrollments')) || enrollmentsData
        const myEnrollments = allEnrollments.filter(e => e.learnerId === user.id)
        setEnrollments(myEnrollments)
        setBatches(JSON.parse(localStorage.getItem('batches')) || batchesData)
        setCourses(JSON.parse(localStorage.getItem('courses')) || coursesData)
    }, [user.id])

    const filteredEnrollments = enrollments.filter(enrollment =>
        filterStatus === 'all' || enrollment.progress.status === filterStatus
    )

    const getStatusBadge = (status) => {
        const variants = {
            'completed': 'success',
            'in-progress': 'info',
            'not-started': 'neutral'
        }
        return variants[status] || 'neutral'
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-display font-bold text-dark-900 dark:text-white">My Courses</h2>
                <p className="text-dark-500 dark:text-dark-400">View your enrolled courses</p>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {['all', 'in-progress', 'completed', 'not-started'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${filterStatus === status
                                ? 'bg-learner-500 text-white'
                                : 'bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-600'
                            }`}
                    >
                        {status.replace('-', ' ')}
                    </button>
                ))}
            </div>

            {/* Courses */}
            {filteredEnrollments.length === 0 ? (
                <EmptyState
                    title="No courses found"
                    description={filterStatus === 'all' ? "You haven't enrolled in any courses yet" : `No ${filterStatus.replace('-', ' ')} courses`}
                    action={<Link to="/learner/discover" className="btn-primary px-4 py-2 rounded-xl">Browse Courses</Link>}
                />
            ) : (
                <div className="space-y-4">
                    {filteredEnrollments.map((enrollment) => {
                        const course = courses.find(c => c.id === enrollment.courseId)
                        const batch = batches.find(b => b.id === enrollment.batchId)
                        const totalSessions = batch?.sessions?.length || 0
                        const completedSessions = enrollment.progress.completedSessions.length
                        const progress = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0

                        return (
                            <Link
                                key={enrollment.id}
                                to={`/learner/course/${course?.id}/batch/${batch?.id}`}
                                className="block"
                            >
                                <Card className="p-6 hover:shadow-card-hover transition-all">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Thumbnail */}
                                        <div className="w-full md:w-48 h-32 rounded-xl bg-gradient-to-br from-learner-400 to-learner-600 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-12 h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-dark-900 dark:text-white">
                                                        {course?.title || 'Unknown Course'}
                                                    </h3>
                                                    <p className="text-sm text-dark-500">{batch?.name}</p>
                                                </div>
                                                <Badge variant={getStatusBadge(enrollment.progress.status)}>
                                                    {enrollment.progress.status.replace('-', ' ')}
                                                </Badge>
                                            </div>

                                            <div className="flex flex-wrap gap-4 text-sm text-dark-500 mb-4">
                                                <span className="flex items-center gap-1 capitalize">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    {course?.mode}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {course?.duration}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                    </svg>
                                                    {completedSessions}/{totalSessions} sessions
                                                </span>
                                            </div>

                                            {/* Progress bar */}
                                            <div>
                                                <div className="flex items-center justify-between text-sm mb-1">
                                                    <span className="text-dark-500">Progress</span>
                                                    <span className="font-medium text-dark-700 dark:text-dark-300">{progress}%</span>
                                                </div>
                                                <div className="h-2 bg-dark-200 dark:bg-dark-600 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-learner-500 rounded-full transition-all"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default LearnerMyCourses
