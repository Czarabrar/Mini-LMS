import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem('notifications')
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications))
    }, [notifications])

    const addNotification = useCallback((notification) => {
        const newNotification = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            read: false,
            ...notification,
        }
        setNotifications(prev => [newNotification, ...prev])
        return newNotification.id
    }, [])

    const markAsRead = useCallback((id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        )
    }, [])

    const markAllAsRead = useCallback(() => {
        setNotifications(prev =>
            prev.map(n => ({ ...n, read: true }))
        )
    }, [])

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
    }, [])

    const clearAll = useCallback(() => {
        setNotifications([])
    }, [])

    const unreadCount = notifications.filter(n => !n.read).length

    const value = {
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
    }

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    )
}

export function useNotifications() {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider')
    }
    return context
}
