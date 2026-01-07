import { forwardRef } from 'react'

const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    loading = false,
    icon: Icon,
    ...props
}, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
        primary: 'btn-primary focus:ring-[var(--color-primary)]',
        secondary: 'btn-secondary focus:ring-[var(--color-primary)]',
        ghost: 'bg-transparent hover:bg-dark-100 dark:hover:bg-dark-700 text-dark-700 dark:text-dark-200',
        danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
        xl: 'px-8 py-4 text-lg',
    }

    return (
        <button
            ref={ref}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : Icon ? (
                <Icon className="w-5 h-5 mr-2" />
            ) : null}
            {children}
        </button>
    )
})

Button.displayName = 'Button'

export default Button
