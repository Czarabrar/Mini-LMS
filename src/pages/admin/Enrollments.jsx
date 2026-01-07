import { useState, useEffect } from 'react'
import { Card, Badge, EmptyState } from '../../components/common'
import enrollmentsData from '../../data/enrollments.json'
import batchesData from '../../data/batches.json'
import coursesData from '../../data/courses.json'
import usersData from '../../data/users.json'

const AdminEnrollments = () => {
    const [enrollments, setEnrollments] = useState([])
    const [batches, setBatches] = useState([])
    const [courses, setCourses] = useState([])
    const [learners, setLearners] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')

    useEffect(() => {
        setEnrollments(JSON.parse(localStorage.getItem('enrollments')) || enrollmentsData)
        setBatches(JSON.parse(localStorage.getItem('batches')) || batchesData)
        setCourses(JSON.parse(localStorage.getItem('courses')) || coursesData)
        const users = JSON.parse(localStorage.getItem('users')) || usersData
        setLearners(users.filter(u => u.role === 'learner'))
    }, [])

    const filteredEnrollments = enrollments.filter(enrollment => {
        const learner = learners.find(l => l.id === enrollment.learnerId)
        const course = courses.find(c => c.id === enrollment.courseId)

        const matchesSearch = learner?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course?.title?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = filterStatus === 'all' || enrollment.progress.status === filterStatus

        return matchesSearch && matchesStatus
    })

    const getStatusBadge = (status) => {
        const variants = {
            'completed': 'success',
            'in-progress': 'info',
            'not-started': 'neutral'
        }
        return variants[status] || 'neutral'
    }

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    // Group by batch
    const enrollmentsByBatch = filteredEnrollments.reduce((acc, enrollment) => {
        const batchId = enrollment.batchId
        if (!acc[batchId]) acc[batchId] = []
        acc[batchId].push(enrollment)
        return acc
    }, {})

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-display font-bold text-dark-900 dark:text-white">Enrollments</h2>
                <p className="text-dark-500 dark:text-dark-400">Monitor learner enrollments and progress</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-dark-900 dark:text-white">{enrollments.length}</p>
                    <p className="text-sm text-dark-500">Total Enrollments</p>
                </Card>
                <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-learner-600">{enrollments.filter(e => e.progress.status === 'completed').length}</p>
                    <p className="text-sm text-dark-500">Completed</p>
                </Card>
                <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-admin-600">{enrollments.filter(e => e.progress.status === 'in-progress').length}</p>
                    <p className="text-sm text-dark-500">In Progress</p>
                </Card>
                <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-dark-400">{enrollments.filter(e => e.progress.status === 'not-started').length}</p>
                    <p className="text-sm text-dark-500">Not Started</p>
                </Card>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search by learner or course..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'completed', 'in-progress', 'not-started'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${filterStatus === status
                                        ? 'bg-admin-600 text-white'
                                        : 'bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-600'
                                    }`}
                            >
                                {status.replace('-', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Enrollments by Batch */}
            {Object.keys(enrollmentsByBatch).length === 0 ? (
                <EmptyState
                    title="No enrollments found"
                    description="Learners will appear here once they enroll in courses"
                />
            ) : (
                <div className="space-y-6">
                    {Object.entries(enrollmentsByBatch).map(([batchId, batchEnrollments]) => {
                        const batch = batches.find(b => b.id === batchId)
                        const course = courses.find(c => c.id === batch?.courseId)

                        return (
                            <Card key={batchId} className="overflow-hidden">
                                {/* Batch Header */}
                                <div className="bg-dark-50 dark:bg-dark-700/50 px-6 py-4 border-b border-dark-200 dark:border-dark-700">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-dark-900 dark:text-white">
                                                {batch?.name || 'Unknown Batch'}
                                            </h3>
                                            <p className="text-sm text-dark-500">
                                                {course?.title || 'Unknown Course'}
                                            </p>
                                        </div>
                                        <Badge variant={batch?.status === 'ongoing' ? 'success' : 'neutral'}>
                                            {batch?.status || 'unknown'}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Enrollments Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-dark-200 dark:border-dark-700">
                                                <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase tracking-wider">
                                                    Learner
                                                </th>
                                                <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase tracking-wider">
                                                    Enrolled On
                                                </th>
                                                <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase tracking-wider">
                                                    Progress
                                                </th>
                                                <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-dark-200 dark:divide-dark-700">
                                            {batchEnrollments.map((enrollment) => {
                                                const learner = learners.find(l => l.id === enrollment.learnerId)
                                                const totalSessions = batch?.sessions?.length || 0
                                                const completedSessions = enrollment.progress.completedSessions.length
                                                const progressPercent = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0

                                                return (
                                                    <tr key={enrollment.id} className="hover:bg-dark-50 dark:hover:bg-dark-700/50">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-learner-500 flex items-center justify-center text-white text-sm font-medium">
                                                                    {learner?.name?.charAt(0) || '?'}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-dark-900 dark:text-white">
                                                                        {learner?.name || 'Unknown'}
                                                                    </p>
                                                                    <p className="text-xs text-dark-500">{learner?.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-dark-600 dark:text-dark-300">
                                                            {formatDate(enrollment.enrolledAt)}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex-1 h-2 bg-dark-200 dark:bg-dark-600 rounded-full overflow-hidden max-w-[120px]">
                                                                    <div
                                                                        className="h-full bg-learner-500 rounded-full transition-all"
                                                                        style={{ width: `${progressPercent}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-sm text-dark-600 dark:text-dark-300">
                                                                    {completedSessions}/{totalSessions}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <Badge variant={getStatusBadge(enrollment.progress.status)}>
                                                                {enrollment.progress.status.replace('-', ' ')}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default AdminEnrollments
