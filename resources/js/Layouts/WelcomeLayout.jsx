import { useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";

import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import Footer from "@/Section/Footer";

export default function WelcomeLayout({ children }) {
    const {
        allKelas: kelasall,
        auth: { user },
    } = usePage().props;

    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState(kelasall);
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    useEffect(() => {
        setFiltered(
            kelasall?.filter((kelas) =>
                kelas?.nama_kelas.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, kelasall]);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <motion.nav
                className="bg-white  fixed shadow-xl w-full z-50"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mx-auto w-full px-6 md:px-12 lg:px-24">
                    <div className="flex h-[80px] justify-between items-center">
                        {/* Logo & Search */}
                        <div className="flex items-center gap-6">
                            <Link href="/">
                                <ApplicationLogo className="h-9 w-auto text-gray-800" />
                            </Link>

                            <div className="relative w-full max-w-md">
                                <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-5 h-5 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.6 3.6a7.5 7.5 0 0013.05 13.05z"
                                        />
                                    </svg>
                                    <input
                                        type="search"
                                        placeholder="Search kelas..."
                                        className="ml-3 w-full bg-transparent focus:outline-none border-none"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />
                                </div>

                                <AnimatePresence>
                                    {search && (
                                        <motion.div
                                            className="absolute mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-auto"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {filtered?.length > 0 ? (
                                                filtered.map((kelas) => (
                                                    <motion.div
                                                        key={kelas.id_kelas}
                                                        initial={{
                                                            opacity: 0,
                                                            x: -10,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            x: 0,
                                                        }}
                                                        transition={{
                                                            duration: 0.3,
                                                        }}
                                                    >
                                                        <Link
                                                            href={`/detail/${kelas.id_kelas}`}
                                                            className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition"
                                                        >
                                                            <img
                                                                src={`/storage/${kelas.banner}`}
                                                                alt={
                                                                    kelas.nama_kelas
                                                                }
                                                                className="w-14 h-10 object-cover rounded-md border"
                                                            />
                                                            <p className="text-sm font-medium text-gray-800">
                                                                {
                                                                    kelas.nama_kelas
                                                                }
                                                            </p>
                                                        </Link>
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <div className="px-4 py-3 text-gray-500 text-sm">
                                                    Tidak ada hasil ditemukan.
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Navigation Right */}
                        <div className="flex items-center gap-6">
                            <NavLink href={route("kursus.index")}>
                                Kursus
                            </NavLink>

                            {user ? (
                                <div className="hidden sm:flex items-center ms-6">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition"
                                                >
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
                                                        className="ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
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
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            {user && user.role === "admin" && (
                                                <Dropdown.Link
                                                    href={route("filament.admin.pages.dashboard")}
                                                >
                                                    Dashboard
                                                </Dropdown.Link>
                                            )}
                                            <Dropdown.Link
                                                href={route("profile.edit")}
                                            >
                                                Profile
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
                                </div>
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

                        {/* Hamburger Menu for Mobile */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (prev) => !prev
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    {!showingNavigationDropdown ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Dropdown */}
                <AnimatePresence>
                    {showingNavigationDropdown && (
                        <motion.div
                            className="sm:hidden"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="space-y-1 pb-3 pt-2">
                                <ResponsiveNavLink href={route("home.index")}>
                                    Dashboard
                                </ResponsiveNavLink>
                            </div>

                            {user && (
                                <div className="border-t border-gray-200 pb-1 pt-4">
                                    <div className="px-4">
                                        <div className="text-base font-medium text-gray-800">
                                            {user.name}
                                        </div>
                                        <div className="text-sm font-medium text-gray-500">
                                            {user.email}
                                        </div>
                                    </div>

                                    <div className="mt-3 space-y-1">
                                        <ResponsiveNavLink
                                            href={route("order.index")}
                                        >
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
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            <main className="pt-20">{children}</main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}
