import { Outlet } from 'react-router-dom'
import { Sidebar, Header } from '../navigation'

const DashboardLayout = ({ title }) => {
    return (
        <div className="min-h-screen bg-pastel-cream dark:bg-dark-950">
            <Sidebar />
            <div className="ml-64">
                <Header title={title} />
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout
