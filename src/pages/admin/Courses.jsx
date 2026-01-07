import { useState, useEffect } from 'react'
import { Card, Button, Modal, Input, Badge, EmptyState } from '../../components/common'
import coursesData from '../../data/courses.json'
import usersData from '../../data/users.json'

const AdminCourses = () => {
    const [courses, setCourses] = useState([])
    const [instructors, setInstructors] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [editingCourse, setEditingCourse] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterMode, setFilterMode] = useState('all')

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duration: '',
        durationHours: '',
        mode: 'online',
        category: '',
        level: 'Beginner',
        instructorIds: [],
    })

    useEffect(() => {
        setCourses(JSON.parse(localStorage.getItem('courses')) || coursesData)
        const users = JSON.parse(localStorage.getItem('users')) || usersData
        setInstructors(users.filter(u => u.role === 'instructor'))
    }, [])

    const saveCourses = (updated) => {
        localStorage.setItem('courses', JSON.stringify(updated))
        setCourses(updated)
    }

    const handleOpenModal = (course = null) => {
        if (course) {
            setEditingCourse(course)
            setFormData({
                title: course.title,
                description: course.description,
                duration: course.duration,
                durationHours: course.durationHours.toString(),
                mode: course.mode,
                category: course.category,
                level: course.level,
                instructorIds: course.instructorIds,
            })
        } else {
            setEditingCourse(null)
            setFormData({
                title: '',
                description: '',
                duration: '',
                durationHours: '',
                mode: 'online',
                category: '',
                level: 'Beginner',
                instructorIds: [],
            })
        }
        setShowModal(true)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (editingCourse) {
            const updated = courses.map(c =>
                c.id === editingCourse.id
                    ? { ...c, ...formData, durationHours: parseInt(formData.durationHours) }
                    : c
            )
            saveCourses(updated)
        } else {
            const newCourse = {
                id: `course-${Date.now()}`,
                ...formData,
                durationHours: parseInt(formData.durationHours),
                thumbnail: null,
                status: 'draft',
                createdAt: new Date().toISOString(),
            }
            saveCourses([...courses, newCourse])
        }

        setShowModal(false)
    }

    const handleDelete = (courseId) => {
        if (confirm('Are you sure you want to delete this course?')) {
            saveCourses(courses.filter(c => c.id !== courseId))
        }
    }

    const togglePublish = (courseId) => {
        const updated = courses.map(c =>
            c.id === courseId
                ? { ...c, status: c.status === 'published' ? 'draft' : 'published' }
                : c
        )
        saveCourses(updated)
    }

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.category.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesMode = filterMode === 'all' || course.mode === filterMode
        return matchesSearch && matchesMode
    })

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
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-display font-bold text-dark-900 dark:text-white">Courses</h2>
                    <p className="text-dark-500 dark:text-dark-400">Manage your course catalog</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Course
                </Button>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
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
                    <div className="flex gap-2">
                        {['all', 'online', 'offline', 'hybrid'].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setFilterMode(mode)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${filterMode === mode
                                        ? 'bg-admin-600 text-white'
                                        : 'bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-600'
                                    }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Courses Grid */}
            {filteredCourses.length === 0 ? (
                <EmptyState
                    title="No courses found"
                    description="Create your first course or adjust your filters"
                    action={<Button onClick={() => handleOpenModal()}>Create Course</Button>}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <Card key={course.id} className="p-0 overflow-hidden">
                            {/* Thumbnail */}
                            <div className="h-40 bg-gradient-to-br from-admin-400 to-admin-600 flex items-center justify-center">
                                <svg className="w-16 h-16 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>

                            <div className="p-5">
                                {/* Tags */}
                                <div className="flex gap-2 mb-3">
                                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getModeColor(course.mode)} capitalize`}>
                                        {course.mode}
                                    </span>
                                    <Badge variant={course.status === 'published' ? 'success' : 'neutral'}>
                                        {course.status}
                                    </Badge>
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2 line-clamp-1">
                                    {course.title}
                                </h3>
                                <p className="text-sm text-dark-500 dark:text-dark-400 mb-4 line-clamp-2">
                                    {course.description}
                                </p>

                                {/* Meta */}
                                <div className="flex items-center gap-4 text-sm text-dark-500 dark:text-dark-400 mb-4">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {course.duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        {course.level}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => handleOpenModal(course)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => togglePublish(course.id)}
                                    >
                                        {course.status === 'published' ? 'Unpublish' : 'Publish'}
                                    </Button>
                                    <button
                                        onClick={() => handleDelete(course.id)}
                                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingCourse ? 'Edit Course' : 'Create Course'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Course Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="input"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Duration (e.g., 6 weeks)"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            required
                        />
                        <Input
                            label="Duration in Hours"
                            type="number"
                            value={formData.durationHours}
                            onChange={(e) => setFormData({ ...formData, durationHours: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                                Mode
                            </label>
                            <select
                                value={formData.mode}
                                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                                className="input"
                            >
                                <option value="online">Online</option>
                                <option value="offline">Offline</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                                Level
                            </label>
                            <select
                                value={formData.level}
                                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                className="input"
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    <Input
                        label="Category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g., Web Development"
                        required
                    />

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
                            {editingCourse ? 'Save Changes' : 'Create Course'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default AdminCourses
