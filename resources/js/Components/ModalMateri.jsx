import React from "react";
import { FaFilePdf, FaDownload, FaTimes, FaCalendarAlt, FaClock } from "react-icons/fa";

const ModalMateri = ({ show, data = [], kelas, onClose }) => {
    if (!show) return null;

    console.log("ModalMateri data:", data);

    const formatTanggalIndo = (tanggalStr) => {
        return new Date(tanggalStr).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // Get all jadwal with materi - updated for new structure
    const jadwalWithMateri = data.filter(
        (jadwal) => jadwal.materis && jadwal.materis.length > 0
    );

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <FaFilePdf className="w-5 h-5" />
                            Materi Kelas
                        </h2>
                        <p className="text-indigo-200 text-sm mt-0.5">{kelas?.nama_kelas}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {jadwalWithMateri.length === 0 ? (
                        <div className="text-center py-8">
                            <FaFilePdf className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">Belum ada materi yang tersedia</p>
                            <p className="text-gray-400 text-sm mt-1">
                                Materi akan muncul setelah pengajar menguploadnya
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {data
                                .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal))
                                .map((jadwal, index) => (
                                    <div key={jadwal.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                        {/* Jadwal Header */}
                                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-indigo-100 rounded-lg p-2 text-center min-w-[50px]">
                                                    <p className="text-xs text-indigo-600 font-medium">Sesi</p>
                                                    <p className="text-lg font-bold text-indigo-700">{index + 1}</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800 flex items-center gap-2">
                                                        <FaCalendarAlt className="w-3 h-3 text-gray-400" />
                                                        {formatTanggalIndo(jadwal.tanggal)}
                                                    </p>
                                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                                        <FaClock className="w-3 h-3 text-gray-400" />
                                                        {jadwal.waktu?.substring(0, 5)} WIB
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Materi List - updated for new structure */}
                                        <div className="p-4">
                                            {!jadwal.materis || jadwal.materis.length === 0 ? (
                                                <p className="text-gray-400 text-sm italic text-center py-2">
                                                    Belum ada materi
                                                </p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {jadwal.materis.map((materi) => (
                                                        <div
                                                            key={materi.id}
                                                            className="flex items-center justify-between bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <FaFilePdf className="w-8 h-8 text-red-500 flex-shrink-0" />
                                                                <div>
                                                                    <p className="font-medium text-gray-800 text-sm">
                                                                        {materi.judul}
                                                                    </p>
                                                                    <p className="text-xs text-gray-400">
                                                                        {materi.filename}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <a
                                                                href={route("materi.download", materi.id)}
                                                                className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                                                            >
                                                                <FaDownload className="w-3 h-3" />
                                                                <span className="hidden sm:inline">Download</span>
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalMateri;
