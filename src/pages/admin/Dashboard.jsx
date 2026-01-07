import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, Badge } from '../../components/common'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts'

import coursesData from '../../data/courses.json'
import batchesData from '../../data/batches.json'
import usersData from '../../data/users.json'
import enrollmentsData from '../../data/enrollments.json'

const StatCard = ({ title, value, icon, trend, color }) => (
    <Card className="p-6">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm text-dark-500 dark:text-dark-400 mb-1">{title}</p>
                <p className="text-3xl font-display font-bold text-dark-900 dark:text-white">{value}</p>
                {trend && (
                    <p className={`text-sm mt-2 ${trend > 0 ? 'text-learner-600' : 'text-red-500'}`}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
                    </p>
                )}
            </div>
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
                {icon}
            </div>
        </div>
    </Card>
)

const AdminDashboard = () => {
    const [courses, setCourses] = useState([])
    const [batches, setBatches] = useState([])
    const [instructors, setInstructors] = useState([])
    const [learners, setLearners] = useState([])
    const [enrollments, setEnrollments] = useState([])

    useEffect(() => {
        // Load data from localStorage or defaults
        setCourses(JSON.parse(localStorage.getItem('courses')) || coursesData)
        setBatches(JSON.parse(localStorage.getItem('batches')) || batchesData)
        setEnrollments(JSON.parse(localStorage.getItem('enrollments')) || enrollmentsData)

        const users = JSON.parse(localStorage.getItem('users')) || usersData
        setInstructors(users.filter(u => u.role === 'instructor'))
        setLearners(users.filter(u => u.role === 'learner'))
    }, [])

    // Stats
    const stats = [
        {
            title: 'Total Courses',
            value: courses.length,
            trend: 12,
            color: 'bg-admin-100 dark:bg-admin-900/50',
            icon: <svg className="w-6 h-6 text-admin-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        },
        {
            title: 'Active Batches',
            value: batches.filter(b => b.status === 'ongoing').length,
            trend: 8,
            color: 'bg-instructor-100 dark:bg-instructor-900/50',
            icon: <svg className="w-6 h-6 text-instructor-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        },
        {
            title: 'Instructors',
            value: instructors.length,
            trend: 5,
            color: 'bg-learner-100 dark:bg-learner-900/50',
            icon: <svg className="w-6 h-6 text-learner-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        },
        {
            title: 'Total Enrollments',
            value: enrollments.length,
            trend: 25,
            color: 'bg-amber-100 dark:bg-amber-900/50',
            icon: <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
        },
    ]

    // Chart data
    const enrollmentTrend = [
        { month: 'Jan', enrollments: 12 },
        { month: 'Feb', enrollments: 19 },
        { month: 'Mar', enrollments: 25 },
        { month: 'Apr', enrollments: 32 },
        { month: 'May', enrollments: 28 },
        { month: 'Jun', enrollments: 35 },
    ]

    const batchStatusData = [
        { name: 'Upcoming', value: batches.filter(b => b.status === 'upcoming').length, color: '#818cf8' },
        { name: 'Ongoing', value: batches.filter(b => b.status === 'ongoing').length, color: '#14b8a6' },
        { name: 'Completed', value: batches.filter(b => b.status === 'completed').length, color: '#10b981' },
    ]

    const coursesByCategory = courses.reduce((acc, course) => {
        acc[course.category] = (acc[course.category] || 0) + 1
        return acc
    }, {})

    const categoryData = Object.entries(coursesByCategory).map(([name, count]) => ({
        name,
        courses: count
    }))

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Enrollment Trend */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-6">
                        Enrollment Trend
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={enrollmentTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="enrollments"
                                    stroke="#4f46e5"
                                    strokeWidth={3}
                                    dot={{ fill: '#4f46e5', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Batch Status */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-6">
                        Batch Status Overview
                    </h3>
                    <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={batchStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {batchStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-2 ml-4">
                            {batchStatusData.map((item) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm text-dark-600 dark:text-dark-300">
                                        {item.name}: {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Courses by Category & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Courses by Category */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-6">
                        Courses by Category
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData} layout="vertical">
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
                                <Bar dataKey="courses" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Recent Activity */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-dark-900 dark:text-white">
                            Recent Activity
                        </h3>
                        <Link to="/admin/enrollments" className="text-sm text-admin-600 hover:text-admin-700">
                            View all
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {enrollments.slice(0, 4).map((enrollment) => {
                            const learner = learners.find(l => l.id === enrollment.learnerId)
                            const course = courses.find(c => c.id === enrollment.courseId)
                            return (
                                <div key={enrollment.id} className="flex items-center gap-4 p-3 rounded-xl bg-dark-50 dark:bg-dark-700/50">
                                    <div className="w-10 h-10 rounded-full bg-learner-500 flex items-center justify-center text-white font-medium">
                                        {learner?.name?.charAt(0) || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-dark-900 dark:text-white truncate">
                                            {learner?.name || 'Unknown'}
                                        </p>
                                        <p className="text-xs text-dark-500 dark:text-dark-400 truncate">
                                            Enrolled in {course?.title || 'Unknown Course'}
                                        </p>
                                    </div>
                                    <Badge variant={enrollment.progress.status === 'completed' ? 'success' : 'info'}>
                                        {enrollment.progress.status}
                                    </Badge>
                                </div>
                            )
                        })}
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default AdminDashboard
