import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useNotifications } from '../../context/NotificationContext'

const Header = ({ title }) => {
    const { user, logout } = useAuth()
    const { isDark, toggleTheme } = useTheme()
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
    const navigate = useNavigate()

    const [showNotifications, setShowNotifications] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const notifRef = useRef(null)
    const userRef = useRef(null)

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifications(false)
            }
            if (userRef.current && !userRef.current.contains(e.target)) {
                setShowUserMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const roleColors = {
        admin: 'from-admin-600 to-admin-700',
        instructor: 'from-instructor-500 to-instructor-600',
        learner: 'from-learner-500 to-learner-600',
    }

    const formatTime = (dateStr) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diff = now - date
        const mins = Math.floor(diff / 60000)
        if (mins < 60) return `${mins}m ago`
        const hours = Math.floor(mins / 60)
        if (hours < 24) return `${hours}h ago`
        return date.toLocaleDateString()
    }

    return (
        <header className="h-16 bg-white dark:bg-dark-900 border-b border-dark-200 dark:border-dark-700 flex items-center justify-between px-6">
            <h1 className="text-xl font-display font-semibold text-dark-900 dark:text-white">
                {title}
            </h1>

            <div className="flex items-center gap-4">
                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
                    title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {isDark ? (
                        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-dark-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    )}
                </button>

                {/* Notifications - only for learners */}
                {user?.role === 'learner' && (
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors relative"
                        >
                            <svg className="w-5 h-5 text-dark-600 dark:text-dark-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-dark-800 rounded-xl shadow-glass-lg border border-dark-200 dark:border-dark-700 overflow-hidden animate-slide-down z-50">
                                <div className="flex items-center justify-between p-4 border-b border-dark-200 dark:border-dark-700">
                                    <h3 className="font-semibold text-dark-900 dark:text-white">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="text-sm text-[var(--color-primary)] hover:underline"
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <p className="p-4 text-center text-dark-500">No notifications</p>
                                    ) : (
                                        notifications.slice(0, 10).map((notif) => (
                                            <div
                                                key={notif.id}
                                                onClick={() => markAsRead(notif.id)}
                                                className={`p-4 border-b border-dark-100 dark:border-dark-700 cursor-pointer hover:bg-dark-50 dark:hover:bg-dark-700 ${!notif.read ? 'bg-[var(--color-primary-light)]' : ''}`}
                                            >
                                                <p className="text-sm text-dark-900 dark:text-white">{notif.title}</p>
                                                <p className="text-xs text-dark-500 mt-1">{notif.message}</p>
                                                <p className="text-xs text-dark-400 mt-2">{formatTime(notif.createdAt)}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* User menu */}
                <div className="relative" ref={userRef}>
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
                    >
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${roleColors[user?.role]} flex items-center justify-center text-white text-sm font-medium`}>
                            {user?.name?.charAt(0)}
                        </div>
                        <svg className="w-4 h-4 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-dark-800 rounded-xl shadow-glass-lg border border-dark-200 dark:border-dark-700 overflow-hidden animate-slide-down z-50">
                            <div className="p-4 border-b border-dark-200 dark:border-dark-700">
                                <p className="font-medium text-dark-900 dark:text-white">{user?.name}</p>
                                <p className="text-sm text-dark-500">{user?.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-3 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
