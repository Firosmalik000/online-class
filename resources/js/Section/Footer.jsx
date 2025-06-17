import React from "react";
import { usePage } from "@inertiajs/react";
import { motion } from "framer-motion";

const Footer = () => {
    const { env } = usePage().props;
    return (
        <motion.footer
            className="bg-gray-900 text-gray-200 pt-16 pb-8 px-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                {/* Branding */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <h2 className="text-2xl font-bold text-yellow-400 mb-4">
                        {env.app_name}
                    </h2>
                    <p className="text-sm">
                        Kursus Sipil Indonesia adalah lembaga kursus terkemuka
                        yang menyediakan pelatihan berkualitas di bidang teknik
                        sipil dan konstruksi.
                    </p>
                    <p className="italic mt-2 text-sm">
                        Build your skill with Kursus Sipil
                    </p>
                </motion.div>

                {/* Contact */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <h3 className="text-xl font-semibold text-white mb-4">
                        Contact With Us
                    </h3>
                    <ul className="text-sm space-y-2">
                        <li>📞 +62 812-5544-2561</li>
                        <li>📧 info@kursussipil.id</li>
                    </ul>
                </motion.div>

                {/* Kategori */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <h3 className="text-xl font-semibold text-white mb-4">
                        Kategori
                    </h3>
                    <ul className="text-sm space-y-2">
                        <li>Geoteknik</li>
                        <li>BIM</li>
                        <li>Hidrologi Hidraulika</li>
                        <li>Enterpreneur</li>
                        <li>Struktur</li>
                        <li>Teknologi</li>
                        <li>Pengembangan Diri</li>
                        <li>Drafting</li>
                        <li>Mankon</li>
                        <li>GIS</li>
                    </ul>
                </motion.div>

                {/* Tentang Kami */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    <h3 className="text-xl font-semibold text-white mb-4">
                        Tentang Kami
                    </h3>
                    <ul className="text-sm space-y-2">
                        <li>
                            <a href="#" className="hover:underline">
                                Contact Us
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">
                                Become Teacher
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">
                                Blog
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">
                                Instructor
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">
                                Events
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">
                                Terima Pembayaran
                            </a>
                        </li>
                    </ul>
                </motion.div>
            </div>

            <motion.div
                className="border-t border-gray-700 mt-12 pt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
            >
                <div className="flex flex-col md:flex-row justify-between items-center text-center text-sm gap-4">
                    <p>© 2025 {env.app_name}. All Rights Reserved</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="#" className="hover:underline">
                            Terms of service
                        </a>
                        <a href="#" className="hover:underline">
                            Privacy policy
                        </a>
                        <a href="#" className="hover:underline">
                            Subscription
                        </a>
                        <a href="#" className="hover:underline">
                            Login & Register
                        </a>
                    </div>
                </div>
            </motion.div>
        </motion.footer>
    );
};

export default Footer;
