import Lottie from 'lottie-react'

const EmptyState = ({
    title = 'No data found',
    description = 'There are no items to display at the moment.',
    animation,
    action,
    className = ''
}) => {
    // Simple animated illustration when no Lottie animation is provided
    const DefaultIllustration = () => (
        <div className="w-48 h-48 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-light)] to-transparent rounded-full animate-pulse-soft" />
            <svg className="w-full h-full text-[var(--color-primary)]" viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" opacity="0.3" />
                <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="2" opacity="0.5" />
                <path d="M80 90 L100 110 L120 90" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="100" cy="75" r="8" fill="currentColor" opacity="0.5" />
            </svg>
        </div>
    )

    return (
        <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
            {animation ? (
                <Lottie
                    animationData={animation}
                    loop
                    className="w-48 h-48 mb-6"
                />
            ) : (
                <DefaultIllustration />
            )}
            <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">
                {title}
            </h3>
            <p className="text-dark-500 dark:text-dark-400 max-w-sm mb-6">
                {description}
            </p>
            {action}
        </div>
    )
}

export default EmptyState
