import { Link } from "@inertiajs/react";
import React from "react";
import { FaChalkboardTeacher, FaInfoCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.3,
            duration: 0.6,
            ease: "easeOut",
        },
    }),
};

const Hero = () => {
    return (
        <section
            className="relative w-full flex flex-col lg:flex-row justify-between min-h-screen items-center py-24 mx-auto bg-cover bg-center"
            style={{ backgroundImage: "url('/Image/hero.png')" }}
        >
            {/* Overlay gradient backdrop */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(to right, rgba(0, 0, 0, 0.85), rgba(0,0,0,0.4), transparent)",
                    zIndex: 0,
                }}
            />

            {/* Text Section */}
            <motion.div
                className="relative flex-1 text-center lg:text-left z-10 px-6 sm:px-12 md:px-20 lg:px-24 max-w-2xl"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: {
                        transition: {
                            staggerChildren: 0.3,
                        },
                    },
                }}
            >
                <motion.div
                    className="text-yellow-400 text-3xl lg:text-4xl font-semibold mb-4 drop-shadow-md"
                    variants={fadeUp}
                    custom={1}
                >
                    🏆 Pilihan terbaik E-Course
                </motion.div>

                <motion.h1
                    className="text-4xl lg:text-5xl font-extrabold mb-6 leading-snug text-yellow-300 drop-shadow-lg"
                    variants={fadeUp}
                    custom={2}
                >
                    Selamat Datang di <br />
                    <span className="text-yellow-400">
                        Kursus Sipil Indonesia
                    </span>
                </motion.h1>

                <motion.p
                    className="max-w-xl text-lg mb-8 mx-auto lg:mx-0 leading-relaxed drop-shadow text-white"
                    variants={fadeUp}
                    custom={3}
                >
                    Kursus Sipil Indonesia adalah lembaga kursus terkemuka yang
                    menyediakan pelatihan berkualitas di bidang teknik sipil dan
                    konstruksi. <br />
                    <span className="italic text-yellow-200">
                        Build your skill with Kursus Sipil
                    </span>
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                    variants={fadeUp}
                    custom={4}
                >
                    <Link
                        href={route("kursus.index")}
                        className="flex items-center justify-center gap-2 bg-yellow-400 text-blue-900 px-7 py-3 rounded-xl font-semibold shadow-lg hover:bg-yellow-300 transition"
                    >
                        <FaChalkboardTeacher size={20} /> Lihat Kelas
                    </Link>
                    <a
                        href="#info"
                        className="flex items-center justify-center gap-2 bg-blue-900 px-7 py-3 text-yellow-300 rounded-xl font-semibold hover:bg-yellow-300 hover:text-blue-900 transition"
                    >
                        <FaInfoCircle size={20} /> Info Pelatihan
                    </a>
                </motion.div>
            </motion.div>

            {/* Spacer kosong untuk layout */}
            <div className="flex-1 hidden lg:block" />
        </section>
    );
};

export default Hero;
