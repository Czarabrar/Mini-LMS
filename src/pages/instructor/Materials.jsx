import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Card, Button, Modal, Input, EmptyState } from '../../components/common'
import batchesData from '../../data/batches.json'
import coursesData from '../../data/courses.json'
import materialsData from '../../data/materials.json'

const InstructorMaterials = () => {
    const { user } = useAuth()
    const [batches, setBatches] = useState([])
    const [courses, setCourses] = useState([])
    const [materials, setMaterials] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const [formData, setFormData] = useState({
        title: '',
        type: 'pdf',
        url: '',
        batchId: '',
    })

    useEffect(() => {
        const allBatches = JSON.parse(localStorage.getItem('batches')) || batchesData
        const myBatches = allBatches.filter(b => b.instructorIds.includes(user.id))
        setBatches(myBatches)
        setCourses(JSON.parse(localStorage.getItem('courses')) || coursesData)

        const allMaterials = JSON.parse(localStorage.getItem('materials')) || materialsData
        const myMaterials = allMaterials.filter(m => myBatches.some(b => b.id === m.batchId))
        setMaterials(myMaterials)
    }, [user.id])

    const handleSubmit = (e) => {
        e.preventDefault()

        const batch = batches.find(b => b.id === formData.batchId)

        const newMaterial = {
            id: `material-${Date.now()}`,
            courseId: batch?.courseId,
            batchId: formData.batchId,
            sessionId: null,
            title: formData.title,
            type: formData.type,
            url: formData.url,
            uploadedBy: user.id,
            uploadedAt: new Date().toISOString(),
        }

        const allMaterials = JSON.parse(localStorage.getItem('materials')) || materialsData
        localStorage.setItem('materials', JSON.stringify([...allMaterials, newMaterial]))
        setMaterials([...materials, newMaterial])

        setShowModal(false)
        setFormData({ title: '', type: 'pdf', url: '', batchId: '' })
    }

    const deleteMaterial = (materialId) => {
        if (confirm('Delete this material?')) {
            const allMaterials = JSON.parse(localStorage.getItem('materials')) || materialsData
            const updated = allMaterials.filter(m => m.id !== materialId)
            localStorage.setItem('materials', JSON.stringify(updated))
            setMaterials(materials.filter(m => m.id !== materialId))
        }
    }

    const filteredMaterials = materials.filter(m =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Group materials by batch
    const materialsByBatch = filteredMaterials.reduce((acc, material) => {
        const batchId = material.batchId
        if (!acc[batchId]) acc[batchId] = []
        acc[batchId].push(material)
        return acc
    }, {})

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-display font-bold text-dark-900 dark:text-white">Materials</h2>
                    <p className="text-dark-500 dark:text-dark-400">Manage learning materials for your batches</p>
                </div>
                <Button onClick={() => setShowModal(true)}>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Material
                </Button>
            </div>

            {/* Search */}
            <div className="max-w-md">
                <Input
                    placeholder="Search materials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={() => (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    )}
                />
            </div>

            {/* Materials by Batch */}
            {Object.keys(materialsByBatch).length === 0 ? (
                <EmptyState
                    title="No materials found"
                    description="Upload learning materials for your learners"
                    action={<Button onClick={() => setShowModal(true)}>Add Material</Button>}
                />
            ) : (
                <div className="space-y-6">
                    {Object.entries(materialsByBatch).map(([batchId, batchMaterials]) => {
                        const batch = batches.find(b => b.id === batchId)
                        const course = courses.find(c => c.id === batch?.courseId)

                        return (
                            <Card key={batchId} className="overflow-hidden">
                                <div className="bg-dark-50 dark:bg-dark-700/50 px-6 py-4 border-b border-dark-200 dark:border-dark-700">
                                    <h3 className="font-semibold text-dark-900 dark:text-white">
                                        {batch?.name || 'Unknown Batch'}
                                    </h3>
                                    <p className="text-sm text-dark-500">{course?.title}</p>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {batchMaterials.map((material) => (
                                            <div key={material.id} className="flex items-center gap-4 p-4 rounded-xl bg-dark-50 dark:bg-dark-700/50">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${material.type === 'pdf' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                                    }`}>
                                                    {material.type === 'pdf' ? (
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-dark-900 dark:text-white truncate">{material.title}</p>
                                                    <p className="text-xs text-dark-500 capitalize">{material.type}</p>
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
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* Add Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Add Learning Material"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                            Batch
                        </label>
                        <select
                            value={formData.batchId}
                            onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                            className="input"
                            required
                        >
                            <option value="">Select a batch</option>
                            {batches.map(batch => (
                                <option key={batch.id} value={batch.id}>{batch.name}</option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Material title"
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                            Type
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="input"
                        >
                            <option value="pdf">PDF Document</option>
                            <option value="video">Video Link</option>
                        </select>
                    </div>

                    <Input
                        label="URL"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder={formData.type === 'pdf' ? '/materials/document.pdf' : 'https://youtube.com/...'}
                        required
                    />

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
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

export default InstructorMaterials
