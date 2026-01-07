import { useState, useEffect } from 'react'
import { Card, Button, Modal, Input, Badge, EmptyState } from '../../components/common'
import usersData from '../../data/users.json'

const AdminInstructors = () => {
    const [instructors, setInstructors] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState('all')
    const [showCredentials, setShowCredentials] = useState(null)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        type: 'internal',
        bio: '',
        specialization: '',
    })

    useEffect(() => {
        const users = JSON.parse(localStorage.getItem('users')) || usersData
        setInstructors(users.filter(u => u.role === 'instructor'))
    }, [])

    const saveInstructors = (updatedInstructors) => {
        const users = JSON.parse(localStorage.getItem('users')) || usersData
        const nonInstructors = users.filter(u => u.role !== 'instructor')
        localStorage.setItem('users', JSON.stringify([...nonInstructors, ...updatedInstructors]))
        setInstructors(updatedInstructors)
    }

    const generateCredentials = () => {
        const randomId = Math.random().toString(36).substring(2, 8)
        return {
            email: `instructor.${randomId}@lms-platform.com`,
            password: `ext${randomId}${Date.now().toString(36).slice(-4)}`
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        let email = formData.email
        let password = formData.password

        if (formData.type === 'external') {
            const creds = generateCredentials()
            email = creds.email
            password = creds.password
        }

        const newInstructor = {
            id: `instructor-${Date.now()}`,
            name: formData.name,
            email,
            password,
            role: 'instructor',
            type: formData.type,
            bio: formData.bio,
            specialization: formData.specialization.split(',').map(s => s.trim()).filter(Boolean),
            avatar: null,
            createdAt: new Date().toISOString(),
            lastLogin: null,
        }

        saveInstructors([...instructors, newInstructor])

        if (formData.type === 'external') {
            setShowCredentials({ email, password, name: formData.name })
        }

        setShowModal(false)
        setFormData({
            name: '',
            email: '',
            password: '',
            type: 'internal',
            bio: '',
            specialization: '',
        })
    }

    const handleDelete = (instructorId) => {
        if (confirm('Are you sure you want to delete this instructor?')) {
            saveInstructors(instructors.filter(i => i.id !== instructorId))
        }
    }

    const filteredInstructors = instructors.filter(instructor => {
        const matchesSearch = instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            instructor.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = filterType === 'all' || instructor.type === filterType
        return matchesSearch && matchesType
    })

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Never'
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-display font-bold text-dark-900 dark:text-white">Instructors</h2>
                    <p className="text-dark-500 dark:text-dark-400">Manage internal and external instructors</p>
                </div>
                <Button onClick={() => setShowModal(true)}>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Instructor
                </Button>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search instructors..."
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
                        {['all', 'internal', 'external'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${filterType === type
                                        ? 'bg-admin-600 text-white'
                                        : 'bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-600'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Instructors List */}
            {filteredInstructors.length === 0 ? (
                <EmptyState
                    title="No instructors found"
                    description="Add your first instructor to get started"
                    action={<Button onClick={() => setShowModal(true)}>Add Instructor</Button>}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredInstructors.map((instructor) => (
                        <Card key={instructor.id} className="p-6">
                            <div className="flex items-start gap-4">
                                {/* Avatar */}
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-semibold ${instructor.type === 'internal' ? 'bg-gradient-to-br from-instructor-400 to-instructor-600' : 'bg-gradient-to-br from-purple-400 to-purple-600'
                                    }`}>
                                    {instructor.name.charAt(0)}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-semibold text-dark-900 dark:text-white truncate">
                                            {instructor.name}
                                        </h3>
                                        <Badge variant={instructor.type === 'internal' ? 'instructor' : 'info'}>
                                            {instructor.type}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-dark-500 dark:text-dark-400 truncate mb-2">
                                        {instructor.email}
                                    </p>
                                    <p className="text-sm text-dark-600 dark:text-dark-300 line-clamp-2 mb-3">
                                        {instructor.bio || 'No bio provided'}
                                    </p>

                                    {/* Specializations */}
                                    {instructor.specialization?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {instructor.specialization.slice(0, 3).map((spec, i) => (
                                                <span key={i} className="px-2 py-1 text-xs rounded-md bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-400">
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Last login */}
                                    <p className="text-xs text-dark-400">
                                        Last login: {formatDate(instructor.lastLogin)}
                                    </p>
                                </div>

                                {/* Actions */}
                                <button
                                    onClick={() => handleDelete(instructor.id)}
                                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Add Instructor"
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                            Instructor Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'internal' })}
                                className={`p-4 rounded-xl border-2 transition-all ${formData.type === 'internal'
                                        ? 'border-instructor-500 bg-instructor-50 dark:bg-instructor-900/30'
                                        : 'border-dark-200 dark:border-dark-700'
                                    }`}
                            >
                                <p className="font-medium text-dark-900 dark:text-white">Internal</p>
                                <p className="text-xs text-dark-500 mt-1">Organizational email</p>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'external' })}
                                className={`p-4 rounded-xl border-2 transition-all ${formData.type === 'external'
                                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                                        : 'border-dark-200 dark:border-dark-700'
                                    }`}
                            >
                                <p className="font-medium text-dark-900 dark:text-white">External</p>
                                <p className="text-xs text-dark-500 mt-1">Auto-generated credentials</p>
                            </button>
                        </div>
                    </div>

                    {formData.type === 'internal' && (
                        <>
                            <Input
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="instructor@institution.com"
                                required
                            />
                            <Input
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </>
                    )}

                    {formData.type === 'external' && (
                        <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-sm text-purple-700 dark:text-purple-300">
                            <p className="font-medium mb-1">System-generated credentials</p>
                            <p>Email and password will be automatically generated and displayed after creation.</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                            Bio
                        </label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            rows={3}
                            className="input"
                            placeholder="Brief description about the instructor..."
                        />
                    </div>

                    <Input
                        label="Specializations"
                        value={formData.specialization}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        placeholder="React, Node.js, Python (comma separated)"
                    />

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1">
                            Add Instructor
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Credentials Modal */}
            <Modal
                isOpen={!!showCredentials}
                onClose={() => setShowCredentials(null)}
                title="Instructor Created"
                size="sm"
            >
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-learner-400 to-learner-600 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">
                        {showCredentials?.name} has been added!
                    </h3>
                    <p className="text-sm text-dark-500 mb-6">
                        Please save these credentials securely:
                    </p>
                    <div className="bg-dark-50 dark:bg-dark-700 rounded-xl p-4 text-left space-y-2">
                        <div>
                            <p className="text-xs text-dark-500 dark:text-dark-400">Email</p>
                            <p className="font-mono text-sm text-dark-900 dark:text-white">{showCredentials?.email}</p>
                        </div>
                        <div>
                            <p className="text-xs text-dark-500 dark:text-dark-400">Password</p>
                            <p className="font-mono text-sm text-dark-900 dark:text-white">{showCredentials?.password}</p>
                        </div>
                    </div>
                    <Button onClick={() => setShowCredentials(null)} className="w-full mt-6">
                        Done
                    </Button>
                </div>
            </Modal>
        </div>
    )
}

export default AdminInstructors
