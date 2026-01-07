import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Card, Badge, EmptyState } from '../../components/common'
import batchesData from '../../data/batches.json'
import coursesData from '../../data/courses.json'

const InstructorBatches = () => {
    const { user } = useAuth()
    const [batches, setBatches] = useState([])
    const [courses, setCourses] = useState([])
    const [filterStatus, setFilterStatus] = useState('all')

    useEffect(() => {
        const allBatches = JSON.parse(localStorage.getItem('batches')) || batchesData
        const myBatches = allBatches.filter(b => b.instructorIds.includes(user.id))
        setBatches(myBatches)
        setCourses(JSON.parse(localStorage.getItem('courses')) || coursesData)
    }, [user.id])

    const filteredBatches = batches.filter(batch =>
        filterStatus === 'all' || batch.status === filterStatus
    )

    const getStatusColor = (status) => {
        const colors = {
            upcoming: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
            ongoing: 'bg-instructor-100 text-instructor-700 dark:bg-instructor-900/50 dark:text-instructor-300',
            completed: 'bg-learner-100 text-learner-700 dark:bg-learner-900/50 dark:text-learner-300',
        }
        return colors[status] || colors.upcoming
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-display font-bold text-dark-900 dark:text-white">My Batches</h2>
                <p className="text-dark-500 dark:text-dark-400">View and manage your assigned batches</p>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {['all', 'upcoming', 'ongoing', 'completed'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${filterStatus === status
                                ? 'bg-instructor-500 text-white'
                                : 'bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-600'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Batches */}
            {filteredBatches.length === 0 ? (
                <EmptyState
                    title="No batches found"
                    description={filterStatus === 'all' ? "You haven't been assigned any batches yet" : `No ${filterStatus} batches`}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredBatches.map((batch) => {
                        const course = courses.find(c => c.id === batch.courseId)
                        const completedSessions = batch.sessions?.filter(s => s.status === 'completed').length || 0
                        const totalSessions = batch.sessions?.length || 0
                        const progress = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0

                        return (
                            <Link
                                key={batch.id}
                                to={`/instructor/batches/${batch.id}`}
                                className="block"
                            >
                                <Card className="p-6 hover:shadow-card-hover transition-all duration-300 h-full">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-instructor-400 to-instructor-600 flex items-center justify-center text-white text-xl font-bold">
                                            {course?.title?.charAt(0) || '?'}
                                        </div>
                                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(batch.status)} capitalize`}>
                                            {batch.status}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-1">
                                        {batch.name}
                                    </h3>
                                    <p className="text-sm text-dark-500 dark:text-dark-400 mb-4">
                                        {course?.title || 'Unknown Course'}
                                    </p>

                                    <div className="space-y-3">
                                        {/* Schedule */}
                                        <div className="flex items-center gap-2 text-sm text-dark-600 dark:text-dark-300">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {batch.schedule.days.join(', ')} • {batch.schedule.time}
                                        </div>

                                        {/* Learners */}
                                        <div className="flex items-center gap-2 text-sm text-dark-600 dark:text-dark-300">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                            {batch.enrolledLearners.length} / {batch.maxLearners} learners
                                        </div>

                                        {/* Progress */}
                                        <div>
                                            <div className="flex items-center justify-between text-sm mb-1">
                                                <span className="text-dark-500">Progress</span>
                                                <span className="font-medium text-dark-700 dark:text-dark-300">{progress}%</span>
                                            </div>
                                            <div className="h-2 bg-dark-200 dark:bg-dark-600 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-instructor-500 rounded-full transition-all"
                                                    style={{ width: `${progress}%` }}
                                                />
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

export default InstructorBatches
