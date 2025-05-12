import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-200 pt-16 pb-8 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
                {/* Branding */}
                <div>
                    <h2 className="text-2xl font-bold text-yellow-400 mb-4">
                        Edu-cause
                    </h2>
                    <p className="text-sm">
                        Kursus Sipil Indonesia adalah lembaga kursus terkemuka
                        yang menyediakan pelatihan berkualitas di bidang teknik
                        sipil dan konstruksi.
                    </p>
                    <p className="italic mt-2 text-sm">
                        Build your skill with Kursus Sipil
                    </p>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-xl font-semibold text-white mb-4">
                        Contact With Us
                    </h3>
                    <ul className="text-sm space-y-2">
                        <li>📞 +62 812-5544-2561</li>
                        <li>📧 info@kursussipil.id</li>
                    </ul>
                </div>

                {/* Kategori */}
                <div>
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
                </div>

                {/* Link lainnya */}
                <div>
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
                </div>
            </div>

            <div className="border-t flex justify-between items-center border-gray-700 mt-12 pt-6 text-center text-sm">
                <p className="mb-2">
                    Copyright © 2025 Kursus Sipil Indonesia. All Rights Reserved
                </p>
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
        </footer>
    );
};

export default Footer;
