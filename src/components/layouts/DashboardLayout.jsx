import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar, Header } from '../navigation'

const DashboardLayout = ({ title }) => {
    const [isCollapsed, setIsCollapsed] = useState(false)

    // Initialize collapsed state from localStorage
    useEffect(() => {
        const savedState = localStorage.getItem('sidebarCollapsed')
        if (savedState !== null) {
            setIsCollapsed(JSON.parse(savedState))
        }
    }, [])

    return (
        <div className="min-h-screen bg-pastel-cream dark:bg-dark-950">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
                <Header title={title} />
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout
