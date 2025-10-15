import DashboardLayout from "@/Layouts/DashboardLayout";
import React, { useState } from "react";

const MyCourse = ({ kursus }) => {
    const [showModal, setShowModal] = useState(false);
    const [jadwalList, setJadwalList] = useState([]);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const openModal = (jadwal) => {
        setJadwalList(jadwal || []);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setJadwalList([]);
    };

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-semibold m-6 text-gray-800">
                Kursus Saya
            </h1>
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm uppercase tracking-wider">
                            <th className="py-3 px-5 text-left">No</th>
                            <th className="py-3 px-5 text-left">Nama Kelas</th>
                            <th className="py-3 px-5 text-left">Kategori</th>
                            <th className="py-3 px-5 text-left">Sesi</th>
                            <th className="py-3 px-5 text-left">Jadwal</th>
                            <th className="py-3 px-5 text-left">Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {kursus.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center py-6 text-gray-500"
                                >
                                    Belum ada kursus yang diikuti.
                                </td>
                            </tr>
                        ) : (
                            kursus.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-gray-50 transition duration-200 text-sm text-gray-700 border-b"
                                >
                                    <td className="py-3 px-5">{index + 1}</td>
                                    <td className="py-3 px-5 font-medium">
                                        {item.pendaftaran?.kelas?.nama_kelas ||
                                            "-"}
                                    </td>
                                    <td className="py-3 px-5">
                                        {item.pendaftaran?.kelas?.kategori ||
                                            "-"}
                                    </td>
                                    <td className="py-3 px-5">
                                        {item.pendaftaran?.kelas?.jadwal
                                            ? item.pendaftaran.kelas.jadwal.length
                                            : 0}
                                        <span className="ml-1 text-gray-400"> sesi</span>
                                    </td>
                                    <td className="py-3 px-5">
                                        <button
                                            onClick={() =>
                                                openModal(
                                                    item.pendaftaran?.kelas
                                                        ?.jadwal
                                                )
                                            }
                                            className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium px-4 py-2 rounded-lg shadow transition duration-200"
                                        >
                                            Lihat Jadwal
                                        </button>
                                    </td>
                                    <td className="py-3 px-5">
                                        {item.pendaftaran?.kelas?.link_zoom ? (
                                            <a
                                                href={
                                                    item.pendaftaran.kelas
                                                        .link_zoom
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-4 py-2 rounded-lg shadow transition duration-200"
                                            >
                                                Masuk Zoom
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 text-sm italic">
                                                Belum tersedia
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Jadwal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-40">
                    <div className="min-h-screen flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative max-h-[80vh] overflow-y-auto">
                            <h2 className="text-xl font-semibold mb-4">Jadwal Kelas</h2>
                            <button
                                onClick={closeModal}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            >
                                &times;
                            </button>
                            {jadwalList.length === 0 ? (
                                <div className="text-gray-500 text-center">Belum ada jadwal.</div>
                            ) : (
                                <ul className="space-y-4">
                                    {jadwalList.map((jadwal, idx) => (
                                        <li key={idx} className="border p-3 rounded">
                                            <div>
                                                <span className="font-medium">Tanggal:</span>{" "}
                                                {formatDate(jadwal.tanggal)}
                                            </div>
                                            <div>
                                                <span className="font-medium">Waktu:</span>{" "}
                                                {jadwal.waktu}
                                            </div>
                                            <div>
                                                <span className="font-medium mb-2">Deskripsi:</span>{" "}
                                                <br />
                                                <span dangerouslySetInnerHTML={{ __html: jadwal.keterangan || "N/A" }} />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default MyCourse;
