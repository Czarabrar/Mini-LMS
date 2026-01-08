import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Card, Badge, EmptyState } from '../../components/common'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import enrollmentsData from '../../data/enrollments.json'
import batchesData from '../../data/batches.json'
import coursesData from '../../data/courses.json'

const LearnerProgress = () => {
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

    // Calculate stats
    const totalCourses = enrollments.length
    const completedCourses = enrollments.filter(e => e.progress.status === 'completed').length
    const inProgressCourses = enrollments.filter(e => e.progress.status === 'in-progress').length
    const notStartedCourses = enrollments.filter(e => e.progress.status === 'not-started').length

    const totalSessionsCompleted = enrollments.reduce((acc, e) => acc + e.progress.completedSessions.length, 0)
    const totalSessionsAvailable = enrollments.reduce((acc, e) => {
        const batch = batches.find(b => b.id === e.batchId)
        return acc + (batch?.sessions?.length || 0)
    }, 0)

    // Chart data
    const statusData = [
        { name: 'Completed', value: completedCourses, color: '#10b981' },
        { name: 'In Progress', value: inProgressCourses, color: '#4f46e5' },
        { name: 'Not Started', value: notStartedCourses, color: '#9ca3af' },
    ].filter(d => d.value > 0)

    const courseProgressData = enrollments.map(enrollment => {
        const course = courses.find(c => c.id === enrollment.courseId)
        const batch = batches.find(b => b.id === enrollment.batchId)
        const totalSessions = batch?.sessions?.length || 0
        const completedSessions = enrollment.progress.completedSessions.length
        const progress = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0

        return {
            name: course?.title?.split(' ').slice(0, 2).join(' ') || 'Unknown',
            progress,
            remaining: 100 - progress
        }
    })

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-display font-bold text-dark-900 dark:text-white">Learning Progress</h2>
                <p className="text-dark-500 dark:text-dark-400">Track your learning journey</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6 text-center">
                    <p className="text-3xl font-bold text-dark-900 dark:text-white">{totalCourses}</p>
                    <p className="text-sm text-dark-500">Total Courses</p>
                </Card>
                <Card className="p-6 text-center">
                    <p className="text-3xl font-bold text-learner-600">{completedCourses}</p>
                    <p className="text-sm text-dark-500">Completed</p>
                </Card>
                <Card className="p-6 text-center">
                    <p className="text-3xl font-bold text-admin-600">{inProgressCourses}</p>
                    <p className="text-sm text-dark-500">In Progress</p>
                </Card>
                <Card className="p-6 text-center">
                    <p className="text-3xl font-bold text-dark-900 dark:text-white">{totalSessionsCompleted}</p>
                    <p className="text-sm text-dark-500">Sessions Done</p>
                </Card>
            </div>

            {enrollments.length === 0 ? (
                <EmptyState
                    title="No courses enrolled"
                    description="Enroll in courses to track your progress"
                    action={<Link to="/learner/discover" className="btn-primary px-4 py-2 rounded-xl">Browse Courses</Link>}
                />
            ) : (
                <>
                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Status Distribution */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-6">
                                Course Status
                            </h3>
                            <div className="h-64 flex items-center justify-center">
                                {statusData.length > 0 ? (
                                    <>
                                        <ResponsiveContainer width="60%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={statusData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {statusData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="space-y-2">
                                            {statusData.map((item) => (
                                                <div key={item.name} className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                                    <span className="text-sm text-dark-600 dark:text-dark-300">
                                                        {item.name}: {item.value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-dark-400">No data</p>
                                )}
                            </div>
                        </Card>

                        {/* Progress by Course */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-6">
                                Progress by Course
                            </h3>
                            <div className="h-64">
                                {courseProgressData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={courseProgressData} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis type="number" domain={[0, 100]} stroke="#6b7280" />
                                            <YAxis dataKey="name" type="category" stroke="#6b7280" width={80} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#1f2937',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    color: '#fff'
                                                }}
                                                formatter={(value) => [`${value}%`, 'Progress']}
                                            />
                                            <Bar dataKey="progress" fill="#10b981" radius={[0, 4, 4, 0]} barSize={16} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-dark-400">
                                        No course data
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Course Progress Detail */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-6">
                            Course Details
                        </h3>
                        <div className="space-y-4">
                            {enrollments.map((enrollment) => {
                                const course = courses.find(c => c.id === enrollment.courseId)
                                const batch = batches.find(b => b.id === enrollment.batchId)
                                const totalSessions = batch?.sessions?.length || 0
                                const completedSessions = enrollment.progress.completedSessions.length
                                const progress = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0

                                return (
                                    <Link
                                        key={enrollment.id}
                                        to={`/learner/course/${course?.id}/batch/${batch?.id}`}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-dark-50 dark:bg-dark-700/50 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${progress === 100 ? 'bg-learner-500' : 'bg-gradient-to-br from-learner-400 to-learner-600'
                                            }`}>
                                            {progress === 100 ? (
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                `${progress}%`
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-dark-900 dark:text-white truncate">
                                                {course?.title || 'Unknown Course'}
                                            </p>
                                            <p className="text-sm text-dark-500">{batch?.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant={
                                                enrollment.progress.status === 'completed' ? 'success' :
                                                    enrollment.progress.status === 'in-progress' ? 'info' : 'neutral'
                                            }>
                                                {enrollment.progress.status.replace('-', ' ')}
                                            </Badge>
                                            <p className="text-xs text-dark-500 mt-1">
                                                {completedSessions}/{totalSessions} sessions
                                            </p>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </Card>
                </>
            )}
        </div>
    )
}

export default LearnerProgress
