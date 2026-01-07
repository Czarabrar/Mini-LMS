const Card = ({
    children,
    className = '',
    hover = true,
    padding = 'md',
    ...props
}) => {
    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    }

    return (
        <div
            className={`card ${paddings[padding]} ${hover ? 'hover:shadow-card-hover' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}

export default Card
