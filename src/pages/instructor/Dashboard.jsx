import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Card, Badge } from '../../components/common'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts'
import batchesData from '../../data/batches.json'
import coursesData from '../../data/courses.json'
import usersData from '../../data/users.json'

const InstructorDashboard = () => {
    const { user } = useAuth()
    const [batches, setBatches] = useState([])
    const [courses, setCourses] = useState([])
    const [learners, setLearners] = useState([])

    useEffect(() => {
        const allBatches = JSON.parse(localStorage.getItem('batches')) || batchesData
        const myBatches = allBatches.filter(b => b.instructorIds.includes(user.id))
        setBatches(myBatches)
        setCourses(JSON.parse(localStorage.getItem('courses')) || coursesData)
        const users = JSON.parse(localStorage.getItem('users')) || usersData
        setLearners(users.filter(u => u.role === 'learner'))
    }, [user.id])

    // Stats
    const totalLearners = batches.reduce((acc, b) => acc + b.enrolledLearners.length, 0)
    const totalSessions = batches.reduce((acc, b) => acc + (b.sessions?.length || 0), 0)
    const completedSessions = batches.reduce((acc, b) =>
        acc + (b.sessions?.filter(s => s.status === 'completed').length || 0), 0
    )

    // Chart data
    const batchProgress = batches.map(batch => {
        const course = courses.find(c => c.id === batch.courseId)
        const total = batch.sessions?.length || 0
        const completed = batch.sessions?.filter(s => s.status === 'completed').length || 0
        return {
            name: batch.name.split(' - ')[0],
            completed,
            remaining: total - completed
        }
    })

    const sessionStatusData = [
        { name: 'Completed', value: completedSessions, color: '#10b981' },
        { name: 'Remaining', value: totalSessions - completedSessions, color: '#e5e7eb' },
    ]

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome */}
            <div className="bg-gradient-to-br from-instructor-400 to-instructor-600 rounded-2xl p-8 text-white">
                <h1 className="text-2xl font-display font-bold mb-2">
                    Welcome back, {user.name}!
                </h1>
                <p className="text-instructor-100">
                    You have {batches.filter(b => b.status === 'ongoing').length} active batches and {totalLearners} learners enrolled.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-instructor-100 dark:bg-instructor-900/50 flex items-center justify-center">
                            <svg className="w-6 h-6 text-instructor-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-dark-900 dark:text-white">{batches.length}</p>
                            <p className="text-sm text-dark-500">My Batches</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-learner-100 dark:bg-learner-900/50 flex items-center justify-center">
                            <svg className="w-6 h-6 text-learner-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-dark-900 dark:text-white">{totalLearners}</p>
                            <p className="text-sm text-dark-500">Learners</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-dark-900 dark:text-white">{totalSessions}</p>
                            <p className="text-sm text-dark-500">Total Sessions</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-dark-900 dark:text-white">{completedSessions}</p>
                            <p className="text-sm text-dark-500">Completed</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Batch Progress */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-6">
                        Batch Progress
                    </h3>
                    <div className="h-64">
                        {batchProgress.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={batchProgress} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis type="number" stroke="#6b7280" />
                                    <YAxis dataKey="name" type="category" stroke="#6b7280" width={100} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1f2937',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                    />
                                    <Bar dataKey="completed" stackId="a" fill="#14b8a6" radius={[0, 0, 0, 0]} />
                                    <Bar dataKey="remaining" stackId="a" fill="#e5e7eb" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-dark-400">
                                No batches assigned yet
                            </div>
                        )}
                    </div>
                </Card>

                {/* Session Completion */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-6">
                        Session Completion
                    </h3>
                    <div className="h-64 flex items-center justify-center">
                        {totalSessions > 0 ? (
                            <>
                                <ResponsiveContainer width="60%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={sessionStatusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {sessionStatusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="text-center">
                                    <p className="text-4xl font-bold text-instructor-600">
                                        {Math.round((completedSessions / totalSessions) * 100)}%
                                    </p>
                                    <p className="text-sm text-dark-500">Complete</p>
                                </div>
                            </>
                        ) : (
                            <div className="text-dark-400">No sessions yet</div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Upcoming Sessions / Active Batches */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-dark-900 dark:text-white">
                        My Batches
                    </h3>
                    <Link to="/instructor/batches" className="text-sm text-instructor-600 hover:text-instructor-700">
                        View all
                    </Link>
                </div>
                <div className="space-y-4">
                    {batches.slice(0, 4).map((batch) => {
                        const course = courses.find(c => c.id === batch.courseId)
                        const sessionsDone = batch.sessions?.filter(s => s.status === 'completed').length || 0
                        const totalBatchSessions = batch.sessions?.length || 0

                        return (
                            <Link
                                key={batch.id}
                                to={`/instructor/batches/${batch.id}`}
                                className="flex items-center gap-4 p-4 rounded-xl bg-dark-50 dark:bg-dark-700/50 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-instructor-400 to-instructor-600 flex items-center justify-center text-white font-bold">
                                    {course?.title?.charAt(0) || '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-dark-900 dark:text-white truncate">
                                        {batch.name}
                                    </p>
                                    <p className="text-sm text-dark-500 truncate">
                                        {course?.title} • {batch.enrolledLearners.length} learners
                                    </p>
                                </div>
                                <div className="text-right">
                                    <Badge variant={batch.status === 'ongoing' ? 'success' : batch.status === 'upcoming' ? 'info' : 'neutral'}>
                                        {batch.status}
                                    </Badge>
                                    <p className="text-xs text-dark-500 mt-1">
                                        {sessionsDone}/{totalBatchSessions} sessions
                                    </p>
                                </div>
                            </Link>
                        )
                    })}
                    {batches.length === 0 && (
                        <p className="text-center text-dark-400 py-8">
                            No batches assigned yet
                        </p>
                    )}
                </div>
            </Card>
        </div>
    )
}

export default InstructorDashboard
