import { useState, useEffect, useRef } from 'react'
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
    const [activeTab, setActiveTab] = useState('video')
    const [videoProgress, setVideoProgress] = useState(0)
    const [isVideoComplete, setIsVideoComplete] = useState(false)

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

        if (currentBatch?.sessions?.length > 0) {
            const firstIncomplete = currentBatch.sessions.find(s => s.status !== 'completed')
            setActiveSession(firstIncomplete || currentBatch.sessions[0])
        }
    }, [courseId, batchId, user.id])

    // Reset video progress when session changes
    useEffect(() => {
        setVideoProgress(0)
        setIsVideoComplete(false)
        if (activeSession && enrollment) {
            const isAlreadyComplete = enrollment.progress.completedSessions.includes(activeSession.id)
            setIsVideoComplete(isAlreadyComplete)
        }
    }, [activeSession?.id, enrollment])

    const markSessionComplete = (sessionId) => {
        const enrollments = JSON.parse(localStorage.getItem('enrollments')) || enrollmentsData
        const updated = enrollments.map(e => {
            if (e.learnerId === user.id && e.batchId === batchId) {
                const completedSessions = [...new Set([...e.progress.completedSessions, sessionId])]
                return {
                    ...e,
                    progress: {
                        ...e.progress,
                        completedSessions,
                        percentage: Math.round((completedSessions.length / (batch?.sessions?.length || 1)) * 100)
                    }
                }
            }
            return e
        })
        localStorage.setItem('enrollments', JSON.stringify(updated))
        setEnrollment(updated.find(e => e.learnerId === user.id && e.batchId === batchId))
        setIsVideoComplete(true)
    }

    // Simulate video progress (in real app, this would come from video player API)
    const simulateVideoProgress = () => {
        if (videoProgress < 100 && !isVideoComplete) {
            setVideoProgress(prev => Math.min(prev + 10, 100))
        }
    }

    const handleVideoComplete = () => {
        if (activeSession && !isVideoComplete) {
            markSessionComplete(activeSession.id)
        }
    }

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
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-learner-400 to-learner-600 flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )
        }
        if (session.status === 'in-progress') {
            return (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                </div>
            )
        }
        return (
            <div className="w-8 h-8 rounded-full bg-dark-100 dark:bg-dark-700 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-dark-400" />
            </div>
        )
    }

    const totalSessions = batch.sessions?.length || 0
    const completedCount = enrollment.progress.completedSessions.length
    const progress = totalSessions > 0 ? Math.round((completedCount / totalSessions) * 100) : 0

    const tabs = activeSession?.type === 'online'
        ? [
            { id: 'video', label: 'Video', icon: '🎥' },
            { id: 'materials', label: 'Materials', icon: '📄' },
            { id: 'notes', label: 'Notes', icon: '📝' },
        ]
        : [
            { id: 'session', label: 'Session Info', icon: '📍' },
            { id: 'materials', label: 'Materials', icon: '📄' },
            { id: 'notes', label: 'Notes', icon: '📝' },
        ]

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <Link to="/learner/my-courses" className="text-sm text-dark-500 hover:text-learner-600 mb-2 inline-flex items-center gap-1 group">
                        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to My Courses
                    </Link>
                    <h2 className="text-2xl font-display font-bold text-dark-900 dark:text-white">{course.title}</h2>
                    <p className="text-dark-500">{batch.name}</p>
                </div>
                <Badge variant={progress === 100 ? 'success' : 'info'} className="text-sm px-4 py-2">
                    {progress}% Complete
                </Badge>
            </div>

            {/* Progress Bar */}
            <Card className="p-5 bg-gradient-to-r from-learner-50 to-emerald-50 dark:from-learner-900/20 dark:to-emerald-900/20 border-learner-100 dark:border-learner-800">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-learner-500 to-learner-600 flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-dark-700 dark:text-dark-300">Course Progress</span>
                            <span className="font-bold text-learner-600 dark:text-learner-400">{completedCount}/{totalSessions} sessions</span>
                        </div>
                        <div className="h-3 bg-white dark:bg-dark-700 rounded-full overflow-hidden shadow-inner">
                            <div
                                className="h-full bg-gradient-to-r from-learner-400 to-learner-600 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Main Content */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Content Area - 3 columns */}
                <div className="xl:col-span-3 space-y-6">
                    {/* Tab Navigation */}
                    <div className="flex gap-2 p-1 bg-dark-100 dark:bg-dark-800 rounded-xl">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all ${activeTab === tab.id
                                        ? 'bg-white dark:bg-dark-700 text-learner-600 dark:text-learner-400 shadow-sm'
                                        : 'text-dark-500 hover:text-dark-700 dark:hover:text-dark-300'
                                    }`}
                            >
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* ONLINE SESSION: Video Player Tab */}
                    {activeTab === 'video' && activeSession?.type === 'online' && (
                        <>
                            {activeSession?.videoUrl ? (
                                <Card className="p-0 overflow-hidden shadow-xl">
                                    <div className="aspect-video bg-dark-900 relative">
                                        <iframe
                                            src={activeSession.videoUrl}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>

                                    {/* Video Progress & Completion */}
                                    <div className="p-5 bg-gradient-to-r from-white to-learner-50/50 dark:from-dark-800 dark:to-learner-900/20">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg text-dark-900 dark:text-white">{activeSession.title}</h3>
                                                <p className="text-sm text-dark-500 mt-1">
                                                    {new Date(activeSession.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                                                    {' • '}{activeSession.duration} min
                                                </p>
                                            </div>
                                            {isVideoComplete || isSessionCompleted(activeSession.id) ? (
                                                <Badge variant="success" className="px-4 py-2">
                                                    ✓ Completed
                                                </Badge>
                                            ) : (
                                                <Button onClick={handleVideoComplete} size="sm">
                                                    Mark as Complete
                                                </Button>
                                            )}
                                        </div>

                                        {/* Video Progress Bar (for demo - would be real progress in production) */}
                                        {!isSessionCompleted(activeSession.id) && !isVideoComplete && (
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs text-dark-500">
                                                    <span>Video Progress</span>
                                                    <span>{videoProgress}%</span>
                                                </div>
                                                <div className="h-2 bg-dark-200 dark:bg-dark-600 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                                                        style={{ width: `${videoProgress}%` }}
                                                    />
                                                </div>
                                                <button
                                                    onClick={simulateVideoProgress}
                                                    className="text-xs text-blue-600 hover:text-blue-700"
                                                >
                                                    Simulate watching (+10%)
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            ) : (
                                <Card className="p-8 text-center">
                                    <div className="w-16 h-16 mx-auto rounded-2xl bg-dark-100 dark:bg-dark-700 flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-dark-900 dark:text-white mb-2">No Video Available Yet</h3>
                                    <p className="text-dark-500 text-sm">The instructor hasn't added a video for this session yet. Check back later!</p>
                                </Card>
                            )}
                        </>
                    )}

                    {/* OFFLINE SESSION: Session Info Tab */}
                    {activeTab === 'session' && activeSession?.type === 'offline' && (
                        <Card className="p-6">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-dark-900 dark:text-white">{activeSession.title}</h3>
                                    <Badge variant="warning" className="mt-2">📍 In-Person Session</Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-100 dark:border-orange-800">
                                    <div className="flex items-center gap-3 mb-2">
                                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="font-medium text-orange-700 dark:text-orange-300">Date & Time</span>
                                    </div>
                                    <p className="text-dark-900 dark:text-white font-semibold">
                                        {new Date(activeSession.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                    <p className="text-sm text-dark-500 mt-1">{activeSession.duration} minutes duration</p>
                                </div>

                                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-100 dark:border-orange-800">
                                    <div className="flex items-center gap-3 mb-2">
                                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="font-medium text-orange-700 dark:text-orange-300">Location</span>
                                    </div>
                                    <p className="text-dark-900 dark:text-white font-semibold">
                                        {activeSession.location || 'To be announced'}
                                    </p>
                                </div>
                            </div>

                            {/* Attendance Status */}
                            <div className={`rounded-xl p-4 ${activeSession.attendance?.[user.id]
                                    ? 'bg-learner-50 dark:bg-learner-900/20 border-2 border-learner-200 dark:border-learner-700'
                                    : 'bg-dark-50 dark:bg-dark-700/50 border-2 border-dark-200 dark:border-dark-600'
                                }`}>
                                <div className="flex items-center gap-3">
                                    {activeSession.attendance?.[user.id] ? (
                                        <>
                                            <div className="w-10 h-10 rounded-full bg-learner-500 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-learner-700 dark:text-learner-300">Attendance Recorded</p>
                                                <p className="text-sm text-learner-600 dark:text-learner-400">You were marked present for this session</p>
                                            </div>
                                        </>
                                    ) : activeSession.attendance ? (
                                        <>
                                            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-red-700 dark:text-red-300">Marked Absent</p>
                                                <p className="text-sm text-red-600 dark:text-red-400">You were not present for this session</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-10 h-10 rounded-full bg-dark-300 dark:bg-dark-600 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-dark-700 dark:text-dark-300">Attendance Pending</p>
                                                <p className="text-sm text-dark-500">Instructor will mark attendance after the session</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Materials Tab */}
                    {activeTab === 'materials' && (
                        <Card className="p-6">
                            <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">📚</span>
                                Learning Materials
                            </h3>
                            {materials.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {materials.map((material) => (
                                        <a
                                            key={material.id}
                                            href={material.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-dark-50 to-white dark:from-dark-700/50 dark:to-dark-800 hover:shadow-md transition-all group border border-dark-100 dark:border-dark-700"
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${material.type === 'pdf'
                                                    ? 'bg-gradient-to-br from-red-400 to-red-600'
                                                    : 'bg-gradient-to-br from-blue-400 to-blue-600'
                                                }`}>
                                                {material.type === 'pdf' ? (
                                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-dark-900 dark:text-white truncate group-hover:text-learner-600 dark:group-hover:text-learner-400 transition-colors">{material.title}</p>
                                                <p className="text-xs text-dark-500 capitalize">{material.type}</p>
                                            </div>
                                            <svg className="w-5 h-5 text-dark-400 group-hover:text-learner-500 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState title="No materials yet" description="Learning materials will appear here once uploaded" />
                            )}
                        </Card>
                    )}

                    {/* Notes Tab */}
                    {activeTab === 'notes' && (
                        <Card className="p-6">
                            <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">📝</span>
                                My Notes
                            </h3>
                            <textarea
                                className="w-full h-64 p-4 rounded-xl border-2 border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 focus:outline-none focus:border-learner-500 focus:ring-4 focus:ring-learner-500/20 transition-all resize-none"
                                placeholder="Take notes while learning..."
                            />
                            <p className="text-xs text-dark-400 mt-2">Notes are saved locally to your browser</p>
                        </Card>
                    )}
                </div>

                {/* Session List Sidebar - 1 column */}
                <div className="xl:col-span-1">
                    <Card className="p-0 overflow-hidden sticky top-6 shadow-lg">
                        <div className="p-4 bg-gradient-to-r from-learner-500 to-learner-600 text-white">
                            <h3 className="font-bold">Course Content</h3>
                            <p className="text-sm opacity-90">{totalSessions} sessions</p>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto">
                            {batch.sessions?.map((session, index) => (
                                <button
                                    key={session.id}
                                    onClick={() => {
                                        setActiveSession(session)
                                        setActiveTab(session.type === 'online' ? 'video' : 'session')
                                    }}
                                    className={`w-full p-4 text-left border-b border-dark-100 dark:border-dark-700 last:border-0 flex items-center gap-3 hover:bg-dark-50 dark:hover:bg-dark-700/50 transition-colors ${activeSession?.id === session.id ? 'bg-learner-50 dark:bg-learner-900/20' : ''
                                        }`}
                                >
                                    {getSessionStatusIcon(session)}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className={`text-sm font-medium truncate ${isSessionCompleted(session.id) ? 'text-dark-400 line-through' : 'text-dark-900 dark:text-white'
                                                }`}>
                                                {index + 1}. {session.title}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${session.type === 'online'
                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300'
                                                }`}>
                                                {session.type === 'online' ? '🎥' : '📍'} {session.type}
                                            </span>
                                            <span className="text-xs text-dark-500">{session.duration}m</span>
                                        </div>
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
