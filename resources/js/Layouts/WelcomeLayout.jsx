import ApplicationLogo from "@/Components/ApplicationLogo";
import NavLink from "@/Components/NavLink";
import Footer from "@/Section/Footer";
import { Link } from "@inertiajs/react";

export default function WelcomeLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 ">
            <nav className="bg-white shadow ">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center gap-6">
                            <Link href="/">
                                <ApplicationLogo className="h-9 w-auto text-gray-800 " />
                            </Link>
                        </div>
                        <div className="flex items-center gap-6">
                            <NavLink
                                href={"/kursus"}
                                // active={route().current("kursus")}
                            >
                                Kursus
                            </NavLink>
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
                        </div>
                    </div>
                </div>
            </nav>
            <main>{children}</main>
            <footer>
                <Footer />
            </footer>
        </div>
    );
}
