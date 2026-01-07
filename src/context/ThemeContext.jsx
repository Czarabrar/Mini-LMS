import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme')
        return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
    })

    const [roleTheme, setRoleTheme] = useState(() => {
        return localStorage.getItem('roleTheme') || 'admin'
    })

    useEffect(() => {
        const root = document.documentElement
        if (isDark) {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
        localStorage.setItem('theme', isDark ? 'dark' : 'light')
    }, [isDark])

    useEffect(() => {
        const root = document.documentElement
        root.classList.remove('theme-admin', 'theme-instructor', 'theme-learner')
        root.classList.add(`theme-${roleTheme}`)
        localStorage.setItem('roleTheme', roleTheme)
    }, [roleTheme])

    const toggleTheme = () => setIsDark(!isDark)

    const value = {
        isDark,
        toggleTheme,
        roleTheme,
        setRoleTheme,
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
