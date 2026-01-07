import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Card, Button, Badge, EmptyState } from '../../components/common'
import coursesData from '../../data/courses.json'
import batchesData from '../../data/batches.json'
import usersData from '../../data/users.json'
import enrollmentsData from '../../data/enrollments.json'

const LearnerCourseDetail = () => {
    const { courseId } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()

    const [course, setCourse] = useState(null)
    const [batches, setBatches] = useState([])
    const [instructors, setInstructors] = useState([])
    const [enrollments, setEnrollments] = useState([])
    const [selectedBatch, setSelectedBatch] = useState(null)

    useEffect(() => {
        const courses = JSON.parse(localStorage.getItem('courses')) || coursesData
        setCourse(courses.find(c => c.id === courseId))

        const allBatches = JSON.parse(localStorage.getItem('batches')) || batchesData
        setBatches(allBatches.filter(b => b.courseId === courseId && b.status !== 'completed'))

        const users = JSON.parse(localStorage.getItem('users')) || usersData
        setInstructors(users.filter(u => u.role === 'instructor'))

        const allEnrollments = JSON.parse(localStorage.getItem('enrollments')) || enrollmentsData
        setEnrollments(allEnrollments.filter(e => e.learnerId === user.id))
    }, [courseId, user.id])

    const handleEnroll = (batchId) => {
        const enrollment = {
            id: `enrollment-${Date.now()}`,
            learnerId: user.id,
            courseId: courseId,
            batchId: batchId,
            enrolledAt: new Date().toISOString(),
            progress: {
                completedSessions: [],
                status: 'not-started'
            }
        }

        const allEnrollments = JSON.parse(localStorage.getItem('enrollments')) || enrollmentsData
        localStorage.setItem('enrollments', JSON.stringify([...allEnrollments, enrollment]))

        // Update batch enrolled learners
        const allBatches = JSON.parse(localStorage.getItem('batches')) || batchesData
        const updatedBatches = allBatches.map(b =>
            b.id === batchId
                ? { ...b, enrolledLearners: [...b.enrolledLearners, user.id] }
                : b
        )
        localStorage.setItem('batches', JSON.stringify(updatedBatches))

        navigate(`/learner/course/${courseId}/batch/${batchId}`)
    }

    const isEnrolled = (batchId) => {
        return enrollments.some(e => e.batchId === batchId)
    }

    const getExistingEnrollment = (batchId) => {
        return enrollments.find(e => e.batchId === batchId)
    }

    if (!course) {
        return (
            <EmptyState
                title="Course not found"
                description="This course doesn't exist"
                action={<Link to="/learner/discover"><Button>Browse Courses</Button></Link>}
            />
        )
    }

    const courseInstructors = instructors.filter(i => course.instructorIds?.includes(i.id))

    const getModeColor = (mode) => {
        const colors = {
            online: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
            offline: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
            hybrid: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
        }
        return colors[mode] || colors.online
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Back */}
            <Link to="/learner/discover" className="text-sm text-dark-500 hover:text-learner-600 inline-flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Discover
            </Link>

            {/* Hero */}
            <div className="bg-gradient-to-br from-learner-400 to-learner-600 rounded-2xl p-8 text-white">
                <div className="flex flex-wrap gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getModeColor(course.mode)} capitalize`}>
                        {course.mode}
                    </span>
                    <span className="px-3 py-1 rounded-lg text-sm font-medium bg-white/20">
                        {course.level}
                    </span>
                    <span className="px-3 py-1 rounded-lg text-sm font-medium bg-white/20">
                        {course.category}
                    </span>
                </div>
                <h1 className="text-3xl font-display font-bold mb-4">{course.title}</h1>
                <p className="text-lg text-white/90 mb-6 max-w-3xl">{course.description}</p>
                <div className="flex flex-wrap gap-6 text-white/80">
                    <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {course.duration} ({course.durationHours} hours)
                    </span>
                    <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        {batches.length} available batch{batches.length !== 1 ? 'es' : ''}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Available Batches */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                            Available Batches
                        </h2>
                        {batches.length === 0 ? (
                            <p className="text-dark-500 text-center py-8">No available batches at this time</p>
                        ) : (
                            <div className="space-y-4">
                                {batches.map((batch) => {
                                    const enrolled = isEnrolled(batch.id)
                                    const spotsLeft = batch.maxLearners - batch.enrolledLearners.length

                                    return (
                                        <div
                                            key={batch.id}
                                            className={`p-4 rounded-xl border-2 transition-all ${selectedBatch === batch.id
                                                    ? 'border-learner-500 bg-learner-50 dark:bg-learner-900/20'
                                                    : 'border-dark-200 dark:border-dark-700 hover:border-dark-300'
                                                }`}
                                            onClick={() => !enrolled && setSelectedBatch(batch.id)}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="font-medium text-dark-900 dark:text-white">{batch.name}</h3>
                                                    <Badge variant={batch.status === 'ongoing' ? 'success' : 'info'}>
                                                        {batch.status}
                                                    </Badge>
                                                </div>
                                                {enrolled ? (
                                                    <Link to={`/learner/course/${courseId}/batch/${batch.id}`}>
                                                        <Button size="sm">Continue</Button>
                                                    </Link>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleEnroll(batch.id)
                                                        }}
                                                        disabled={spotsLeft <= 0}
                                                    >
                                                        {spotsLeft > 0 ? 'Enroll Now' : 'Full'}
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-4 text-sm text-dark-500">
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {new Date(batch.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - {new Date(batch.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {batch.schedule.days.join(', ')} • {batch.schedule.time}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                    </svg>
                                                    {spotsLeft} spots left
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Instructors */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-dark-900 dark:text-white mb-4">Instructors</h3>
                        {courseInstructors.length === 0 ? (
                            <p className="text-sm text-dark-500">No instructors assigned</p>
                        ) : (
                            <div className="space-y-3">
                                {courseInstructors.map((instructor) => (
                                    <div key={instructor.id} className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-instructor-500 flex items-center justify-center text-white font-medium">
                                            {instructor.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-dark-900 dark:text-white text-sm">{instructor.name}</p>
                                            <p className="text-xs text-dark-500">{instructor.type}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Course Info */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-dark-900 dark:text-white mb-4">Course Info</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-dark-500">Duration</span>
                                <span className="font-medium text-dark-900 dark:text-white">{course.duration}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-dark-500">Total Hours</span>
                                <span className="font-medium text-dark-900 dark:text-white">{course.durationHours} hrs</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-dark-500">Level</span>
                                <span className="font-medium text-dark-900 dark:text-white">{course.level}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-dark-500">Mode</span>
                                <span className="font-medium text-dark-900 dark:text-white capitalize">{course.mode}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default LearnerCourseDetail
