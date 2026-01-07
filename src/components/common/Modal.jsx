import { useEffect, useRef } from 'react'

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showClose = true
}) => {
    const modalRef = useRef(null)

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose()
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-[90vw]',
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    ref={modalRef}
                    className={`relative w-full ${sizes[size]} bg-white dark:bg-dark-800 rounded-2xl shadow-glass-lg animate-scale-in`}
                >
                    {/* Header */}
                    {(title || showClose) && (
                        <div className="flex items-center justify-between p-6 border-b border-dark-200 dark:border-dark-700">
                            {title && (
                                <h3 className="text-lg font-semibold text-dark-900 dark:text-white">
                                    {title}
                                </h3>
                            )}
                            {showClose && (
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
                                >
                                    <svg className="w-5 h-5 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal
