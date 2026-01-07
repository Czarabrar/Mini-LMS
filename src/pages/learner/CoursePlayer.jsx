import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Card, Badge, EmptyState, Button } from '../../components/common'
import coursesData from '../../data/courses.json'
import batchesData from '../../data/batches.json'
import enrollmentsData from '../../data/enrollments.json'
import materialsData from '../../data/materials.json'

const LearnerCoursePlayer = () => {
    const { courseId, batchId } = useParams()
    const { user } = useAuth()

    const [course, setCourse] = useState(null)
    const [batch, setBatch] = useState(null)
    const [enrollment, setEnrollment] = useState(null)
    const [materials, setMaterials] = useState([])
    const [activeSession, setActiveSession] = useState(null)
    const [activeTab, setActiveTab] = useState('sessions')

    useEffect(() => {
        const courses = JSON.parse(localStorage.getItem('courses')) || coursesData
        setCourse(courses.find(c => c.id === courseId))

        const batches = JSON.parse(localStorage.getItem('batches')) || batchesData
        const currentBatch = batches.find(b => b.id === batchId)
        setBatch(currentBatch)

        const enrollments = JSON.parse(localStorage.getItem('enrollments')) || enrollmentsData
        setEnrollment(enrollments.find(e => e.learnerId === user.id && e.batchId === batchId))

        const allMaterials = JSON.parse(localStorage.getItem('materials')) || materialsData
        setMaterials(allMaterials.filter(m => m.batchId === batchId))

        // Set first incomplete session as active
        if (currentBatch?.sessions?.length > 0) {
            const firstIncomplete = currentBatch.sessions.find(s => s.status !== 'completed')
            setActiveSession(firstIncomplete || currentBatch.sessions[0])
        }
    }, [courseId, batchId, user.id])

    if (!course || !batch || !enrollment) {
        return (
            <EmptyState
                title="Course not found"
                description="You may not be enrolled in this course"
                action={<Link to="/learner/my-courses"><Button>My Courses</Button></Link>}
            />
        )
    }

    const isSessionCompleted = (sessionId) => {
        return enrollment.progress.completedSessions.includes(sessionId)
    }

    const getSessionStatusIcon = (session) => {
        if (isSessionCompleted(session.id)) {
            return (
                <div className="w-8 h-8 rounded-full bg-learner-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )
        }
        if (session.status === 'in-progress') {
            return (
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                </div>
            )
        }
        return (
            <div className="w-8 h-8 rounded-full bg-dark-200 dark:bg-dark-600 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-dark-400" />
            </div>
        )
    }

    const totalSessions = batch.sessions?.length || 0
    const completedCount = enrollment.progress.completedSessions.length
    const progress = totalSessions > 0 ? Math.round((completedCount / totalSessions) * 100) : 0

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <Link to="/learner/my-courses" className="text-sm text-dark-500 hover:text-learner-600 mb-2 inline-flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to My Courses
                    </Link>
                    <h2 className="text-2xl font-display font-bold text-dark-900 dark:text-white">{course.title}</h2>
                    <p className="text-dark-500">{batch.name}</p>
                </div>
                <Badge variant={progress === 100 ? 'success' : 'info'}>
                    {progress}% Complete
                </Badge>
            </div>

            {/* Progress Bar */}
            <Card className="p-4">
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-dark-500">Course Progress</span>
                            <span className="font-medium text-dark-700 dark:text-dark-300">{completedCount}/{totalSessions} sessions</span>
                        </div>
                        <div className="h-3 bg-dark-200 dark:bg-dark-600 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-learner-400 to-learner-600 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Video/Calendar */}
                <div className="lg:col-span-2 space-y-6">
                    {course.mode === 'online' && activeSession?.videoUrl ? (
                        <Card className="p-0 overflow-hidden">
                            <div className="aspect-video bg-dark-900">
                                <iframe
                                    src={activeSession.videoUrl}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-dark-900 dark:text-white">{activeSession.title}</h3>
                                <p className="text-sm text-dark-500 mt-1">
                                    {new Date(activeSession.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </Card>
                    ) : course.mode === 'offline' || course.mode === 'hybrid' ? (
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                                Session Calendar
                            </h3>
                            <div className="space-y-3">
                                {batch.sessions?.map((session) => (
                                    <div
                                        key={session.id}
                                        className={`p-4 rounded-xl border-2 transition-all ${session.type === 'offline'
                                                ? 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20'
                                                : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {getSessionStatusIcon(session)}
                                                <div>
                                                    <p className="font-medium text-dark-900 dark:text-white">{session.title}</p>
                                                    <p className="text-sm text-dark-500">
                                                        {new Date(session.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                                                        {' • '}{session.duration} min
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant={session.type === 'offline' ? 'warning' : 'info'}>
                                                    {session.type}
                                                </Badge>
                                                {session.location && (
                                                    <p className="text-xs text-dark-500 mt-1">{session.location}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ) : (
                        <Card className="p-6">
                            <EmptyState
                                title="No content available"
                                description="Session content will appear here"
                            />
                        </Card>
                    )}

                    {/* Materials */}
                    {materials.length > 0 && (
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
                                Learning Materials
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {materials.map((material) => (
                                    <a
                                        key={material.id}
                                        href={material.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 p-4 rounded-xl bg-dark-50 dark:bg-dark-700/50 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
                                    >
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${material.type === 'pdf' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                            }`}>
                                            {material.type === 'pdf' ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-dark-900 dark:text-white truncate">{material.title}</p>
                                            <p className="text-xs text-dark-500 capitalize">{material.type}</p>
                                        </div>
                                        <svg className="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>

                {/* Sidebar - Session List */}
                <div>
                    <Card className="p-0 overflow-hidden sticky top-6">
                        <div className="p-4 bg-dark-50 dark:bg-dark-700/50 border-b border-dark-200 dark:border-dark-700">
                            <h3 className="font-semibold text-dark-900 dark:text-white">Course Content</h3>
                            <p className="text-sm text-dark-500">{totalSessions} sessions</p>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto">
                            {batch.sessions?.map((session, index) => (
                                <button
                                    key={session.id}
                                    onClick={() => setActiveSession(session)}
                                    className={`w-full p-4 text-left border-b border-dark-100 dark:border-dark-700 last:border-0 flex items-center gap-3 hover:bg-dark-50 dark:hover:bg-dark-700/50 transition-colors ${activeSession?.id === session.id ? 'bg-learner-50 dark:bg-learner-900/20' : ''
                                        }`}
                                >
                                    {getSessionStatusIcon(session)}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${isSessionCompleted(session.id) ? 'text-dark-500 line-through' : 'text-dark-900 dark:text-white'
                                            }`}>
                                            {index + 1}. {session.title}
                                        </p>
                                        <p className="text-xs text-dark-500">{session.duration} min</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default LearnerCoursePlayer
