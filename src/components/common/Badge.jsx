const Badge = ({
    children,
    variant = 'neutral',
    size = 'md',
    className = ''
}) => {
    const variants = {
        success: 'badge-success',
        warning: 'badge-warning',
        info: 'badge-info',
        neutral: 'badge-neutral',
        admin: 'bg-admin-100 text-admin-700 dark:bg-admin-900 dark:text-admin-300',
        instructor: 'bg-instructor-100 text-instructor-700 dark:bg-instructor-900 dark:text-instructor-300',
        learner: 'bg-learner-100 text-learner-700 dark:bg-learner-900 dark:text-learner-300',
    }

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-xs',
        lg: 'px-4 py-1.5 text-sm',
    }

    return (
        <span className={`badge ${variants[variant]} ${sizes[size]} ${className}`}>
            {children}
        </span>
    )
}

export default Badge
