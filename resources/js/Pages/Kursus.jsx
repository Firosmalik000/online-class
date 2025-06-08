import TextInput from "@/Components/TextInput";
import WelcomeLayout from "@/Layouts/WelcomeLayout";
import EventSection from "@/Section/EventSection";
import { usePage } from "@inertiajs/react";
import React, { useState } from "react";
import { FaTag } from "react-icons/fa";

const Kursus = () => {
    const [filter, setFilter] = useState("semua");
    const [search, setSearch] = useState("");
    const { kelas, kategori } = usePage().props;

    return (
        <WelcomeLayout>
            <div className="flex min-h-screen items-start justify-center px-6 md:px-24 pt-16 gap-6">
                {/* Sidebar Kategori */}
                <aside className="w-full md:w-1/6 bg-white shadow-md rounded-xl p-5 sticky top-24">
                    <div className="w-full mb-2">
                        <TextInput
                            type="text"
                            placeholder="Cari Kursus"
                            className="w-full"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-gray-800">
                            Kategori Kursus
                        </h2>
                        <div className="space-y-3">
                            {kategori.map((kategori, index) => (
                                <div
                                    onClick={() => setFilter(kategori)}
                                    key={index}
                                    className="relative z-10 flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 transition cursor-pointer"
                                >
                                    <FaTag className="text-blue-500" />
                                    <span className="text-gray-700 font-medium">
                                        {kategori.charAt(0).toUpperCase() +
                                            kategori.slice(1)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Konten Event */}
                <div className="flex w-full md:w-5/6">
                    <EventSection
                        kelas={kelas}
                        filter={filter}
                        search={search}
                    />
                </div>
            </div>
        </WelcomeLayout>
    );
};

export default Kursus;
