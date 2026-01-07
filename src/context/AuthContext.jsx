import { createContext, useContext, useState, useEffect } from 'react'
import { useTheme } from './ThemeContext'
import usersData from '../data/users.json'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const { setRoleTheme } = useTheme()
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user')
        return saved ? JSON.parse(saved) : null
    })
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user))
            setRoleTheme(user.role)
            // Update last login
            const users = JSON.parse(localStorage.getItem('users') || JSON.stringify(usersData))
            const updatedUsers = users.map(u =>
                u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u
            )
            localStorage.setItem('users', JSON.stringify(updatedUsers))
        } else {
            localStorage.removeItem('user')
        }
    }, [user, setRoleTheme])

    // Initialize users in localStorage
    useEffect(() => {
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify(usersData))
        }
    }, [])

    const login = async (email, password, role) => {
        setIsLoading(true)

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        const users = JSON.parse(localStorage.getItem('users') || JSON.stringify(usersData))
        const foundUser = users.find(u =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password &&
            u.role === role
        )

        setIsLoading(false)

        if (foundUser) {
            const { password: _, ...userWithoutPassword } = foundUser
            setUser(userWithoutPassword)
            return { success: true, user: userWithoutPassword }
        }

        return { success: false, error: 'Invalid credentials' }
    }

    const logout = () => {
        setUser(null)
        setRoleTheme('admin')
    }

    const value = {
        user,
        login,
        logout,
        isLoading,
        isAuthenticated: !!user,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
