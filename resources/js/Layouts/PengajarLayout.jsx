import ApplicationLogo from "@/Components/ApplicationLogo";
import NavLink from "@/Components/NavLink";
import Dropdown from "@/Components/Dropdown";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import { 
    FaHome, 
    FaBook, 
    FaCalendarAlt, 
    FaFileAlt, 
    FaCog,
    FaBars,
    FaTimes
} from "react-icons/fa";

export default function PengajarLayout({ children, pengajar }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: "Dashboard", href: route("pengajar.dashboard"), icon: FaHome },
        { name: "Kelas Saya", href: route("pengajar.kelas"), icon: FaBook },
        { name: "Jadwal", href: route("pengajar.jadwal"), icon: FaCalendarAlt },
        { name: "Materi", href: route("pengajar.materi"), icon: FaFileAlt },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 z-50 w-64 h-screen bg-gradient-to-b from-indigo-700 to-indigo-900 
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:fixed
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-indigo-600">
                        <Link href="/" className="flex items-center">
                            <ApplicationLogo className="h-10 w-auto text-white" />
                            <span className="ml-2 text-xl font-bold text-white">Portal Pengajar</span>
                        </Link>
                        <button 
                            className="lg:hidden text-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <FaTimes className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Profile Card */}
                    <div className="px-4 py-4">
                        <div className="bg-indigo-800 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src={pengajar?.foto ? `/storage/${pengajar.foto}` : '/Image/default-avatar.png'}
                                    alt={pengajar?.nama || user.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400"
                                />
                                <div>
                                    <p className="font-semibold text-white">{pengajar?.nama || user.name}</p>
                                    <p className="text-sm text-indigo-300">{pengajar?.keahlian || 'Pengajar'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-2 space-y-1">
                        {navigation.map((item) => {
                            const isActive = route().current(item.href.split('/').pop());
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                                        ${isActive 
                                            ? 'bg-indigo-600 text-white' 
                                            : 'text-indigo-200 hover:bg-indigo-600 hover:text-white'
                                        }
                                    `}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom links */}
                    <div className="px-4 py-4 border-t border-indigo-600">
                        <Link
                            href={route("profile.edit")}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-200 hover:bg-indigo-600 hover:text-white transition-colors"
                        >
                            <FaCog className="w-5 h-5" />
                            <span>Pengaturan</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
                {/* Top Header */}
                <header className="bg-white shadow-sm sticky top-0 z-30">
                    <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                        <button
                            className="lg:hidden text-gray-600 hover:text-gray-900"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <FaBars className="w-6 h-6" />
                        </button>

                        <div className="flex-1 lg:flex-none" />

                        <div className="flex items-center gap-4">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                                        <img
                                            src={user.foto ? `/storage/${user.foto}` : '/Image/default-avatar.png'}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <span className="hidden sm:inline">{user.name}</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route("profile.edit")}>
                                        Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route("home.index")}>
                                        Kembali ke Home
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route("logout")} method="post" as="button">
                                        Logout
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
