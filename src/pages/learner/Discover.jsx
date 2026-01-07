import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, Badge, EmptyState, Input } from '../../components/common'
import coursesData from '../../data/courses.json'
import batchesData from '../../data/batches.json'

const LearnerDiscover = () => {
    const [courses, setCourses] = useState([])
    const [batches, setBatches] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filterMode, setFilterMode] = useState('all')
    const [filterLevel, setFilterLevel] = useState('all')

    useEffect(() => {
        const allCourses = JSON.parse(localStorage.getItem('courses')) || coursesData
        setCourses(allCourses.filter(c => c.status === 'published'))
        setBatches(JSON.parse(localStorage.getItem('batches')) || batchesData)
    }, [])

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.category.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesMode = filterMode === 'all' || course.mode === filterMode
        const matchesLevel = filterLevel === 'all' || course.level === filterLevel
        return matchesSearch && matchesMode && matchesLevel
    })

    const getModeColor = (mode) => {
        const colors = {
            online: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
            offline: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
            hybrid: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
        }
        return colors[mode] || colors.online
    }

    const getAvailableBatches = (courseId) => {
        return batches.filter(b => b.courseId === courseId && b.status !== 'completed')
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-display font-bold text-dark-900 dark:text-white">Discover Courses</h2>
                <p className="text-dark-500 dark:text-dark-400">Browse and enroll in available courses</p>
            </div>

            {/* Search & Filters */}
            <Card className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={() => (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            )}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <div className="flex gap-1">
                            {['all', 'online', 'offline', 'hybrid'].map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setFilterMode(mode)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${filterMode === mode
                                            ? 'bg-learner-500 text-white'
                                            : 'bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-300'
                                        }`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-1">
                            {['all', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setFilterLevel(level)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filterLevel === level
                                            ? 'bg-learner-500 text-white'
                                            : 'bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-300'
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Courses Grid */}
            {filteredCourses.length === 0 ? (
                <EmptyState
                    title="No courses found"
                    description="Try adjusting your search or filters"
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => {
                        const availableBatches = getAvailableBatches(course.id)

                        return (
                            <Link
                                key={course.id}
                                to={`/learner/course/${course.id}`}
                                className="block"
                            >
                                <Card className="p-0 overflow-hidden h-full hover:shadow-card-hover transition-all group">
                                    {/* Thumbnail */}
                                    <div className="h-40 bg-gradient-to-br from-learner-400 to-learner-600 flex items-center justify-center relative overflow-hidden">
                                        <svg className="w-16 h-16 text-white/50 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>

                                    <div className="p-5">
                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getModeColor(course.mode)} capitalize`}>
                                                {course.mode}
                                            </span>
                                            <span className="px-2 py-1 rounded-md text-xs font-medium bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-300">
                                                {course.level}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2 line-clamp-1">
                                            {course.title}
                                        </h3>
                                        <p className="text-sm text-dark-500 dark:text-dark-400 mb-4 line-clamp-2">
                                            {course.description}
                                        </p>

                                        {/* Meta */}
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-3 text-dark-500">
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {course.duration}
                                                </span>
                                            </div>
                                            {availableBatches.length > 0 ? (
                                                <Badge variant="success">
                                                    {availableBatches.length} batch{availableBatches.length > 1 ? 'es' : ''}
                                                </Badge>
                                            ) : (
                                                <Badge variant="neutral">No batches</Badge>
                                            )}
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

export default LearnerDiscover
