import PrimaryButton from "@/Components/PrimaryButton";
import React from "react";
import {
    FaCertificate,
    FaBook,
    FaUsers,
    FaComments,
    FaMapMarkedAlt,
    FaDraftingCompass,
    FaTools,
    FaClipboardList,
    FaChalkboardTeacher,
} from "react-icons/fa";

const EventSection = () => {
    const data = [
        {
            id: 1,
            title: "Pelatihan Geoteknik Dasar",
            date: "2025-06-01",
            tema: "Dasar-dasar Geoteknik untuk Pemula",
            time: "09:00 - 12:00",
            mentor: "Ir. Budi Santoso, M.T.",
            status: "online",
            image: "https://source.unsplash.com/800x400/?geotechnical,construction",
            facility: [
                { icon: <FaCertificate />, name: "E-Certificate" },
                { icon: <FaBook />, name: "Materi Pelatihan" },
                { icon: <FaUsers />, name: "Grup Diskusi" },
            ],
        },
        {
            id: 2,
            title: "Workshop BIM untuk Sipil",
            date: "2025-06-10",
            tema: "Implementasi BIM dalam Proyek Konstruksi",
            time: "13:00 - 16:00",
            mentor: "Eng. Andi Pratama",
            status: "online",
            image: "https://source.unsplash.com/800x400/?BIM,architecture",
            facility: [
                { icon: <FaCertificate />, name: "E-Certificate" },
                { icon: <FaBook />, name: "File BIM & Materi" },
                { icon: <FaComments />, name: "Forum Diskusi" },
            ],
        },
        {
            id: 3,
            title: "Manajemen Proyek Konstruksi",
            date: "2025-07-05",
            tema: "Strategi Efektif dalam Manajemen Proyek",
            time: "10:00 - 13:00",
            mentor: "Dr. Rina Mulyani",
            status: "offline",
            image: "https://source.unsplash.com/800x400/?project,management,construction",
            facility: [
                { icon: <FaCertificate />, name: "Sertifikat Cetak" },
                { icon: <FaBook />, name: "Materi & Tools Proyek" },
                { icon: <FaUsers />, name: "Diskusi Langsung" },
            ],
        },
        {
            id: 4,
            title: "Teknik Struktur Bangunan Tinggi",
            date: "2025-07-15",
            tema: "Perancangan Struktur Gedung Bertingkat",
            time: "14:00 - 17:00",
            mentor: "Ir. Sinta Lestari",
            status: "online",
            image: "https://source.unsplash.com/800x400/?skyscraper,structure",
            facility: [
                { icon: <FaCertificate />, name: "E-Certificate" },
                { icon: <FaBook />, name: "Materi Lengkap" },
                { icon: <FaComments />, name: "QnA Live" },
            ],
        },
        {
            id: 5,
            title: "Dasar-dasar GIS untuk Teknik Sipil",
            date: "2025-07-20",
            tema: "Penggunaan GIS dalam Perencanaan Infrastruktur",
            time: "09:00 - 11:30",
            mentor: "Ahmad Ridwan, S.T.",
            status: "online",
            image: "https://source.unsplash.com/800x400/?gis,mapping",
            facility: [
                { icon: <FaCertificate />, name: "E-Certificate" },
                { icon: <FaMapMarkedAlt />, name: "Data GIS" },
                { icon: <FaBook />, name: "Materi Pelatihan" },
            ],
        },
        {
            id: 6,
            title: "Pelatihan Drafting AutoCAD",
            date: "2025-08-01",
            tema: "Teknik Dasar & Lanjutan AutoCAD",
            time: "08:00 - 11:00",
            mentor: "Dewi Kurniawati",
            status: "offline",
            image: "https://source.unsplash.com/800x400/?autocad,drafting",
            facility: [
                { icon: <FaCertificate />, name: "Sertifikat" },
                { icon: <FaDraftingCompass />, name: "Template AutoCAD" },
                { icon: <FaUsers />, name: "Praktek Langsung" },
            ],
        },
        {
            id: 7,
            title: "Hidrologi dan Hidraulika",
            date: "2025-08-08",
            tema: "Konsep dan Implementasi dalam Proyek",
            time: "10:00 - 13:00",
            mentor: "Dr. Hendra Susanto",
            status: "online",
            image: "https://source.unsplash.com/800x400/?hydrology,water,engineering",
            facility: [
                { icon: <FaCertificate />, name: "E-Certificate" },
                { icon: <FaBook />, name: "Modul Lengkap" },
                { icon: <FaComments />, name: "Diskusi Interaktif" },
            ],
        },
        {
            id: 8,
            title: "Teknologi Beton Mutakhir",
            date: "2025-08-15",
            tema: "Inovasi Material Beton",
            time: "13:30 - 16:00",
            mentor: "Ir. Doni Setiawan",
            status: "offline",
            image: "https://source.unsplash.com/800x400/?concrete,construction",
            facility: [
                { icon: <FaCertificate />, name: "Sertifikat Fisik" },
                { icon: <FaTools />, name: "Studi Kasus" },
                { icon: <FaBook />, name: "Materi Cetak" },
            ],
        },
        {
            id: 9,
            title: "Enterpreneur Konstruksi",
            date: "2025-08-25",
            tema: "Membangun Bisnis Konstruksi",
            time: "09:00 - 12:00",
            mentor: "Agus Riyanto",
            status: "online",
            image: "https://source.unsplash.com/800x400/?entrepreneur,business",
            facility: [
                { icon: <FaCertificate />, name: "E-Certificate" },
                { icon: <FaClipboardList />, name: "Business Plan Template" },
                { icon: <FaUsers />, name: "Kelas Interaktif" },
            ],
        },
        {
            id: 10,
            title: "Soft Skill untuk Insinyur",
            date: "2025-09-01",
            tema: "Komunikasi, Kepemimpinan, dan Teamwork",
            time: "13:00 - 15:30",
            mentor: "Nina Putri",
            status: "online",
            image: "https://source.unsplash.com/800x400/?leadership,teamwork,engineer",
            facility: [
                { icon: <FaCertificate />, name: "E-Certificate" },
                { icon: <FaChalkboardTeacher />, name: "Workshop Online" },
                { icon: <FaComments />, name: "Simulasi & Roleplay" },
            ],
        },
    ];
    return (
        <section className="py-10 px-5 bg-gray-50">
            <h2 className="text-3xl font-bold text-center mb-8">
                Event Terbaru
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((event) => (
                    <div
                        key={event.id}
                        className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
                    >
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-5">
                            <h3 className="text-xl font-semibold">
                                {event.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {event.tema}
                            </p>
                            <div className="mt-2 text-sm">
                                <p>
                                    <strong>Tanggal:</strong> {event.date}
                                </p>
                                <p>
                                    <strong>Waktu:</strong> {event.time}
                                </p>
                                <p>
                                    <strong>Mentor:</strong> {event.mentor}
                                </p>
                                <p>
                                    <strong>Status:</strong> {event.status}
                                </p>
                            </div>
                            <div className="mt-3">
                                <h4 className="font-medium">Fasilitas:</h4>
                                <ul className="flex flex-wrap gap-2 mt-1 text-sm text-gray-700">
                                    {event.facility.map((fac, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"
                                        >
                                            {fac.icon} {fac.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <PrimaryButton className="mt-3 w-full flex items-center justify-center">
                                Daftar Sekarang
                            </PrimaryButton>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default EventSection;
