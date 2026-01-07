import { forwardRef } from 'react'

const Input = forwardRef(({
    label,
    error,
    className = '',
    type = 'text',
    icon: Icon,
    ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-dark-400" />
                    </div>
                )}
                <input
                    ref={ref}
                    type={type}
                    className={`input ${Icon ? 'pl-11' : ''} ${error ? 'border-red-500 focus:ring-red-200' : ''} ${className}`}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1.5 text-sm text-red-500">{error}</p>
            )}
        </div>
    )
})

Input.displayName = 'Input'

export default Input
