import { Link } from "@inertiajs/react";
import React from "react";
import { FaChalkboardTeacher, FaInfoCircle } from "react-icons/fa";

const Hero = () => {
    return (
        <section className="flex flex-col-reverse lg:flex-row justify-between items-center py-20   mx-auto">
            {/* Text Section */}
            <div className="flex-1 text-center lg:text-left">
                <div className="text-yellow-400 text-3xl lg:text-4xl mb-2">
                    🏆 Pilihan terbaik E-Course
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                    Selamat Datang di <br />
                    <span className="text-yellow-300">
                        Kursus Sipil Indonesia
                    </span>
                </h1>
                <p className="max-w-xl text-lg mb-6 mx-auto lg:mx-0">
                    Kursus Sipil Indonesia adalah lembaga kursus terkemuka yang
                    menyediakan pelatihan berkualitas di bidang teknik sipil dan
                    konstruksi. <br />
                    <span className="italic">
                        Build your skill with Kursus Sipil
                    </span>
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link
                        href={route("kursus.index")}
                        className="flex items-center justify-center gap-2 bg-yellow-400 text-blue-800 px-6 py-3 rounded-xl font-semibold shadow hover:bg-yellow-300 transition"
                    >
                        <FaChalkboardTeacher /> Lihat Kelas
                    </Link>
                    <a
                        href="#info"
                        className="flex items-center justify-center gap-2 bg-blue-800 px-6 py-3 text-white rounded-xl font-semibold hover:bg-white hover:text-blue-800 transition"
                    >
                        <FaInfoCircle /> Info Pelatihan
                    </a>
                </div>
            </div>

            {/* Image Section */}
            <div className="flex-1 mb-10 lg:mb-0">
                <img
                    src="/Image/hero.png"
                    alt="Online Learning Illustration"
                    className="w-full h-[300px] mx-auto"
                />
            </div>
        </section>
    );
};

export default Hero;
