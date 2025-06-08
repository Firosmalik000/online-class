import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import Footer from "@/Section/Footer";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function DashboardLayout({ children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-700 shadow-lg h-screen sticky top-0 hidden sm:block">
                <div className="px-6 py-4">
                    <Link href="/">
                        <ApplicationLogo className="h-10 w-auto text-gray-800 mb-4" />
                    </Link>
                    <div className="bg-white rounded-lg p-4 my-2">
                        <div className="flex items-center gap-x-2">
                            <img
                                className="w-10 h-10 rounded-full"
                                src={`/storage/${user.foto}`}
                                alt={user.name}
                            />
                            <div>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-sm text-gray-500">
                                    {user.role.replace(/^./, (match) =>
                                        match.toUpperCase()
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    <nav className="flex flex-col gap-2 mt-4">
                        <NavLink href={route("course.myCourse")}>
                            Kursus Saya
                        </NavLink>
                        <NavLink href={route("order.index")}>
                            Order Detail
                        </NavLink>
                        <NavLink href="/profile">Setting</NavLink>
                    </nav>
                </div>
            </aside>

            {/* Main layout */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Navbar */}
                <header className="bg-white shadow px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (prev) => !prev
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="hidden sm:flex gap-6 items-center">
                            <NavLink href={route("home.index")}>Home</NavLink>
                        </div>
                        <div className="flex items-center gap-4">
                            {user ? (
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="flex items-center text-sm text-gray-600 hover:text-gray-800">
                                            {user.foto ? (
                                                <img
                                                    className="w-10 h-10 rounded-full"
                                                    src={`/storage/${user.foto}`}
                                                    alt={user.name}
                                                />
                                            ) : (
                                                user.name
                                            )}
                                            <svg
                                                className="ml-1 w-4 h-4"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("order.index")}
                                        >
                                            Dashboard
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            ) : (
                                <div className="flex gap-x-2">
                                    <Link
                                        href={route("login")}
                                        className="rounded px-4 py-2 text-sm font-medium text-white bg-[#FF2D20] hover:bg-[#e0261a] transition"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        className="rounded px-4 py-2 text-sm font-medium text-white bg-[#FF2D20] hover:bg-[#e0261a] transition"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Responsive nav */}
                    {showingNavigationDropdown && (
                        <div className="sm:hidden pt-2 pb-3 space-y-1">
                            <ResponsiveNavLink href={route("order.index")}>
                                Dashboard
                            </ResponsiveNavLink>

                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    )}
                </header>

                {/* Main content */}
                <main className="flex-1 p-4">{children}</main>

                {/* Footer */}
                <footer className="bg-white border-t">
                    <Footer />
                </footer>
            </div>
        </div>
    );
}
