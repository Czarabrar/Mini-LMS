import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'
import { Card, Button, Modal, Input, Badge, EmptyState } from '../../components/common'
import batchesData from '../../data/batches.json'
import coursesData from '../../data/courses.json'
import usersData from '../../data/users.json'
import materialsData from '../../data/materials.json'

const InstructorBatchDetail = () => {
    const { batchId } = useParams()
    const { user } = useAuth()
    const { addNotification } = useNotifications()

    const [batch, setBatch] = useState(null)
    const [course, setCourse] = useState(null)
    const [learners, setLearners] = useState([])
    const [materials, setMaterials] = useState([])
    const [showMaterialModal, setShowMaterialModal] = useState(false)
    const [activeTab, setActiveTab] = useState('sessions')

    const [materialForm, setMaterialForm] = useState({
        title: '',
        type: 'pdf',
        url: '',
        sessionId: '',
    })

    useEffect(() => {
        const batches = JSON.parse(localStorage.getItem('batches')) || batchesData
        const currentBatch = batches.find(b => b.id === batchId)
        setBatch(currentBatch)

        const courses = JSON.parse(localStorage.getItem('courses')) || coursesData
        setCourse(courses.find(c => c.id === currentBatch?.courseId))

        const users = JSON.parse(localStorage.getItem('users')) || usersData
        const batchLearners = users.filter(u => currentBatch?.enrolledLearners.includes(u.id))
        setLearners(batchLearners)

        const allMaterials = JSON.parse(localStorage.getItem('materials')) || materialsData
        setMaterials(allMaterials.filter(m => m.batchId === batchId))
    }, [batchId])

    const saveBatches = (updated) => {
        localStorage.setItem('batches', JSON.stringify(updated))
        const currentBatch = updated.find(b => b.id === batchId)
        setBatch(currentBatch)
    }

    const markSessionComplete = (sessionId) => {
        const batches = JSON.parse(localStorage.getItem('batches')) || batchesData
        const updated = batches.map(b => {
            if (b.id === batchId) {
                return {
                    ...b,
                    sessions: b.sessions.map(s =>
                        s.id === sessionId ? { ...s, status: 'completed' } : s
                    )
                }
            }
            return b
        })
        saveBatches(updated)

        // Notify learners
        learners.forEach(learner => {
            addNotification({
                title: 'Session Completed',
                message: `A session has been marked as completed in ${batch.name}`,
                userId: learner.id
            })
        })
    }

    const handleAddMaterial = (e) => {
        e.preventDefault()

        const newMaterial = {
            id: `material-${Date.now()}`,
            courseId: course?.id,
            batchId: batchId,
            sessionId: materialForm.sessionId || null,
            title: materialForm.title,
            type: materialForm.type,
            url: materialForm.url,
            uploadedBy: user.id,
            uploadedAt: new Date().toISOString(),
        }

        const allMaterials = JSON.parse(localStorage.getItem('materials')) || materialsData
        const updated = [...allMaterials, newMaterial]
        localStorage.setItem('materials', JSON.stringify(updated))
        setMaterials([...materials, newMaterial])

        // Notify learners
        learners.forEach(learner => {
            addNotification({
                title: 'New Material Added',
                message: `${materialForm.title} has been added to ${batch.name}`,
                userId: learner.id
            })
        })

        setShowMaterialModal(false)
        setMaterialForm({ title: '', type: 'pdf', url: '', sessionId: '' })
    }

    const deleteMaterial = (materialId) => {
        if (confirm('Delete this material?')) {
            const allMaterials = JSON.parse(localStorage.getItem('materials')) || materialsData
            const updated = allMaterials.filter(m => m.id !== materialId)
            localStorage.setItem('materials', JSON.stringify(updated))
            setMaterials(materials.filter(m => m.id !== materialId))
        }
    }

    if (!batch) {
        return (
            <EmptyState
                title="Batch not found"
                description="This batch doesn't exist or you don't have access"
                action={<Link to="/instructor/batches"><Button>Back to Batches</Button></Link>}
            />
        )
    }

    const getSessionStatusColor = (status) => {
        const colors = {
            'not-started': 'bg-dark-100 text-dark-600 dark:bg-dark-700 dark:text-dark-400',
            'in-progress': 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
            'completed': 'bg-learner-100 text-learner-700 dark:bg-learner-900/50 dark:text-learner-300',
        }
        return colors[status] || colors['not-started']
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <Link to="/instructor/batches" className="text-sm text-dark-500 hover:text-instructor-600 mb-2 inline-flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Batches
                    </Link>
                    <h2 className="text-2xl font-display font-bold text-dark-900 dark:text-white">{batch.name}</h2>
                    <p className="text-dark-500 dark:text-dark-400">{course?.title}</p>
                </div>
                <Badge variant={batch.status === 'ongoing' ? 'success' : 'info'}>
                    {batch.status}
                </Badge>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-dark-900 dark:text-white">{learners.length}</p>
                    <p className="text-sm text-dark-500">Learners</p>
                </Card>
                <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-dark-900 dark:text-white">{batch.sessions?.length || 0}</p>
                    <p className="text-sm text-dark-500">Sessions</p>
                </Card>
                <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-learner-600">
                        {batch.sessions?.filter(s => s.status === 'completed').length || 0}
                    </p>
                    <p className="text-sm text-dark-500">Completed</p>
                </Card>
                <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-dark-900 dark:text-white">{materials.length}</p>
                    <p className="text-sm text-dark-500">Materials</p>
                </Card>
            </div>

            {/* Tabs */}
            <div className="border-b border-dark-200 dark:border-dark-700">
                <div className="flex gap-4">
                    {['sessions', 'learners', 'materials'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab
                                    ? 'border-instructor-500 text-instructor-600'
                                    : 'border-transparent text-dark-500 hover:text-dark-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sessions Tab */}
            {activeTab === 'sessions' && (
                <div className="space-y-4">
                    {batch.sessions?.length === 0 ? (
                        <EmptyState title="No sessions" description="No sessions have been scheduled for this batch" />
                    ) : (
                        batch.sessions?.map((session, index) => (
                            <Card key={session.id} className="p-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-instructor-100 dark:bg-instructor-900/50 flex items-center justify-center text-instructor-600 font-bold">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-dark-900 dark:text-white">{session.title}</h4>
                                        <div className="flex items-center gap-4 text-sm text-dark-500 mt-1">
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {new Date(session.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                            <span className="capitalize">{session.type}</span>
                                            <span>{session.duration} min</span>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getSessionStatusColor(session.status)}`}>
                                        {session.status.replace('-', ' ')}
                                    </span>
                                    {session.status !== 'completed' && (
                                        <Button size="sm" onClick={() => markSessionComplete(session.id)}>
                                            Mark Complete
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {/* Learners Tab */}
            {activeTab === 'learners' && (
                <div className="space-y-4">
                    {learners.length === 0 ? (
                        <EmptyState title="No learners" description="No learners have enrolled in this batch yet" />
                    ) : (
                        learners.map((learner) => (
                            <Card key={learner.id} className="p-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-learner-500 flex items-center justify-center text-white font-medium">
                                        {learner.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-dark-900 dark:text-white">{learner.name}</p>
                                        <p className="text-sm text-dark-500">{learner.email}</p>
                                    </div>
                                    <span className="text-sm text-dark-500">{learner.department || 'N/A'}</span>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {/* Materials Tab */}
            {activeTab === 'materials' && (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <Button onClick={() => setShowMaterialModal(true)}>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Material
                        </Button>
                    </div>

                    {materials.length === 0 ? (
                        <EmptyState
                            title="No materials"
                            description="Add learning materials for your learners"
                            action={<Button onClick={() => setShowMaterialModal(true)}>Add Material</Button>}
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {materials.map((material) => (
                                <Card key={material.id} className="p-4">
                                    <div className="flex items-start gap-4">
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
                                            <p className="text-xs text-dark-500 mt-1 capitalize">{material.type}</p>
                                        </div>
                                        <button
                                            onClick={() => deleteMaterial(material.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Add Material Modal */}
            <Modal
                isOpen={showMaterialModal}
                onClose={() => setShowMaterialModal(false)}
                title="Add Learning Material"
            >
                <form onSubmit={handleAddMaterial} className="space-y-4">
                    <Input
                        label="Title"
                        value={materialForm.title}
                        onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                        placeholder="Material title"
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                            Type
                        </label>
                        <select
                            value={materialForm.type}
                            onChange={(e) => setMaterialForm({ ...materialForm, type: e.target.value })}
                            className="input"
                        >
                            <option value="pdf">PDF Document</option>
                            <option value="video">Video Link</option>
                        </select>
                    </div>

                    <Input
                        label="URL"
                        value={materialForm.url}
                        onChange={(e) => setMaterialForm({ ...materialForm, url: e.target.value })}
                        placeholder={materialForm.type === 'pdf' ? '/materials/document.pdf' : 'https://youtube.com/...'}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                            Link to Session (Optional)
                        </label>
                        <select
                            value={materialForm.sessionId}
                            onChange={(e) => setMaterialForm({ ...materialForm, sessionId: e.target.value })}
                            className="input"
                        >
                            <option value="">General material</option>
                            {batch.sessions?.map(session => (
                                <option key={session.id} value={session.id}>{session.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setShowMaterialModal(false)} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1">
                            Add Material
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default InstructorBatchDetail
