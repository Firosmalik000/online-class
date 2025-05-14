import { Kategori } from "@/Data";
import WelcomeLayout from "@/Layouts/WelcomeLayout";
import EventSection from "@/Section/EventSection";
import React from "react";
import { FaTag } from "react-icons/fa";

const Kursus = () => {
    return (
        <WelcomeLayout>
            <div className="flex min-h-screen items-start justify-center px-6 md:px-24 mt-16 gap-6">
                {/* Sidebar Kategori */}
                <aside className="w-full md:w-1/4 bg-white shadow-md rounded-xl p-5 sticky top-24">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">
                        Kategori Kursus
                    </h2>
                    <ul className="space-y-3">
                        {Kategori.map((kategori) => (
                            <li
                                key={kategori.id}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
                            >
                                <FaTag className="text-blue-500" />
                                <span className="text-gray-700 font-medium">
                                    {kategori.nama}
                                </span>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Konten Event */}
                <div className="flex w-full md:w-3/4">
                    <EventSection />
                </div>
            </div>
        </WelcomeLayout>
    );
};

export default Kursus;
