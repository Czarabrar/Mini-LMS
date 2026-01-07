import { useState, useEffect } from 'react'
import { Card, Button, Modal, Input, Badge, EmptyState } from '../../components/common'
import batchesData from '../../data/batches.json'
import coursesData from '../../data/courses.json'
import usersData from '../../data/users.json'

const AdminBatches = () => {
    const [batches, setBatches] = useState([])
    const [courses, setCourses] = useState([])
    const [instructors, setInstructors] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')

    const [formData, setFormData] = useState({
        courseId: '',
        name: '',
        startDate: '',
        endDate: '',
        maxLearners: 25,
        instructorIds: [],
        scheduleDays: [],
        scheduleTime: '',
    })

    useEffect(() => {
        setBatches(JSON.parse(localStorage.getItem('batches')) || batchesData)
        setCourses(JSON.parse(localStorage.getItem('courses')) || coursesData)
        const users = JSON.parse(localStorage.getItem('users')) || usersData
        setInstructors(users.filter(u => u.role === 'instructor'))
    }, [])

    const saveBatches = (updated) => {
        localStorage.setItem('batches', JSON.stringify(updated))
        setBatches(updated)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const newBatch = {
            id: `batch-${Date.now()}`,
            courseId: formData.courseId,
            name: formData.name,
            instructorIds: formData.instructorIds,
            startDate: formData.startDate,
            endDate: formData.endDate,
            maxLearners: parseInt(formData.maxLearners),
            enrolledLearners: [],
            schedule: {
                days: formData.scheduleDays,
                time: formData.scheduleTime,
                timezone: 'GMT'
            },
            status: 'upcoming',
            sessions: []
        }

        saveBatches([...batches, newBatch])
        setShowModal(false)
        setFormData({
            courseId: '',
            name: '',
            startDate: '',
            endDate: '',
            maxLearners: 25,
            instructorIds: [],
            scheduleDays: [],
            scheduleTime: '',
        })
    }

    const handleDelete = (batchId) => {
        if (confirm('Are you sure you want to delete this batch?')) {
            saveBatches(batches.filter(b => b.id !== batchId))
        }
    }

    const updateStatus = (batchId, newStatus) => {
        saveBatches(batches.map(b => b.id === batchId ? { ...b, status: newStatus } : b))
    }

    const filteredBatches = batches.filter(batch => {
        const course = courses.find(c => c.id === batch.courseId)
        const matchesSearch = batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course?.title?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = filterStatus === 'all' || batch.status === filterStatus
        return matchesSearch && matchesStatus
    })

    const getStatusColor = (status) => {
        const colors = {
            upcoming: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
            ongoing: 'bg-instructor-100 text-instructor-700 dark:bg-instructor-900/50 dark:text-instructor-300',
            completed: 'bg-learner-100 text-learner-700 dark:bg-learner-900/50 dark:text-learner-300',
        }
        return colors[status] || colors.upcoming
    }

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-display font-bold text-dark-900 dark:text-white">Batches</h2>
                    <p className="text-dark-500 dark:text-dark-400">Manage course batches and schedules</p>
                </div>
                <Button onClick={() => setShowModal(true)}>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Batch
                </Button>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search batches..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={() => (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            )}
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'upcoming', 'ongoing', 'completed'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${filterStatus === status
                                        ? 'bg-admin-600 text-white'
                                        : 'bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-600'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Batches List */}
            {filteredBatches.length === 0 ? (
                <EmptyState
                    title="No batches found"
                    description="Create your first batch to start scheduling"
                    action={<Button onClick={() => setShowModal(true)}>Create Batch</Button>}
                />
            ) : (
                <div className="space-y-4">
                    {filteredBatches.map((batch) => {
                        const course = courses.find(c => c.id === batch.courseId)
                        const batchInstructors = instructors.filter(i => batch.instructorIds.includes(i.id))

                        return (
                            <Card key={batch.id} className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                    {/* Main Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-dark-900 dark:text-white">
                                                {batch.name}
                                            </h3>
                                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(batch.status)} capitalize`}>
                                                {batch.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-dark-500 dark:text-dark-400 mb-3">
                                            {course?.title || 'Unknown Course'}
                                        </p>

                                        <div className="flex flex-wrap gap-4 text-sm text-dark-600 dark:text-dark-300">
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {new Date(batch.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - {new Date(batch.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
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
                                                {batch.enrolledLearners.length}/{batch.maxLearners} enrolled
                                            </span>
                                        </div>
                                    </div>

                                    {/* Instructors */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {batchInstructors.slice(0, 3).map((instructor) => (
                                                <div
                                                    key={instructor.id}
                                                    className="w-8 h-8 rounded-full bg-instructor-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white dark:border-dark-800"
                                                    title={instructor.name}
                                                >
                                                    {instructor.name.charAt(0)}
                                                </div>
                                            ))}
                                        </div>
                                        {batchInstructors.length > 0 && (
                                            <span className="text-sm text-dark-500 dark:text-dark-400">
                                                {batchInstructors.map(i => i.name).join(', ')}
                                            </span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        {batch.status === 'upcoming' && (
                                            <Button variant="secondary" size="sm" onClick={() => updateStatus(batch.id, 'ongoing')}>
                                                Start
                                            </Button>
                                        )}
                                        {batch.status === 'ongoing' && (
                                            <Button variant="secondary" size="sm" onClick={() => updateStatus(batch.id, 'completed')}>
                                                Complete
                                            </Button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(batch.id)}
                                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* Create Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Create Batch"
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                            Course
                        </label>
                        <select
                            value={formData.courseId}
                            onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                            className="input"
                            required
                        >
                            <option value="">Select a course</option>
                            {courses.filter(c => c.status === 'published').map(course => (
                                <option key={course.id} value={course.id}>{course.title}</option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Batch Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., React Cohort - March 2024"
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Start Date"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            required
                        />
                        <Input
                            label="End Date"
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Max Learners"
                            type="number"
                            value={formData.maxLearners}
                            onChange={(e) => setFormData({ ...formData, maxLearners: e.target.value })}
                            required
                        />
                        <Input
                            label="Schedule Time"
                            value={formData.scheduleTime}
                            onChange={(e) => setFormData({ ...formData, scheduleTime: e.target.value })}
                            placeholder="e.g., 10:00 AM - 12:00 PM"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                            Schedule Days
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {daysOfWeek.map(day => (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => {
                                        const days = formData.scheduleDays.includes(day)
                                            ? formData.scheduleDays.filter(d => d !== day)
                                            : [...formData.scheduleDays, day]
                                        setFormData({ ...formData, scheduleDays: days })
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${formData.scheduleDays.includes(day)
                                            ? 'bg-admin-600 text-white'
                                            : 'bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-300'
                                        }`}
                                >
                                    {day.slice(0, 3)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                            Assign Instructors
                        </label>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                            {instructors.map((instructor) => (
                                <label key={instructor.id} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.instructorIds.includes(instructor.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setFormData({ ...formData, instructorIds: [...formData.instructorIds, instructor.id] })
                                            } else {
                                                setFormData({ ...formData, instructorIds: formData.instructorIds.filter(id => id !== instructor.id) })
                                            }
                                        }}
                                        className="rounded border-dark-300 text-admin-600 focus:ring-admin-500"
                                    />
                                    <span className="text-sm text-dark-700 dark:text-dark-300">{instructor.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1">
                            Create Batch
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default AdminBatches
