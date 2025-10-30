import React, { useEffect, useState } from "react";
import { FaCalendarDay, FaClock } from "react-icons/fa";

const ModalJadwal = ({ 
    show, 
    data = [], 
    onClose, 
    onSelect, 
    selected: selectedDefault = [],
    mode = "edit" 
}) => {
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        if (show && Array.isArray(selectedDefault)) {
            setSelected(selectedDefault);
        } else if (!show) {
            setSelected([]);
        }
    }, [show, selectedDefault]);

    if (!show) return null;

    const formatTanggalIndo = (tanggalStr, waktuStr) => {
        const tanggal = new Date(tanggalStr);
        const formatted = new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(tanggal);

        return `${formatted} • ${waktuStr}`;
    };

    const isJadwalSelected = (jadwal) => {
        return selected.some(
            (s) => s.tanggal === jadwal.tanggal && s.waktu === jadwal.waktu
        );
    };

    const toggleSelect = (jadwal) => {
        if (mode === "view") return; 
        
        setSelected((prev) => {
            const isAlreadySelected = prev.some(
                (s) => s.tanggal === jadwal.tanggal && s.waktu === jadwal.waktu
            );
            
            if (isAlreadySelected) {
                return prev.filter(
                    (s) => !(s.tanggal === jadwal.tanggal && s.waktu === jadwal.waktu)
                );
            } else {
                return [...prev, jadwal];
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaCalendarDay className="mr-2 text-indigo-600" />
                    {mode === "view" ? "Jadwal Saya" : "Pilih Jadwal"}
                </h2>

                <div className="space-y-3">
                    {mode === "view" ? (
                        selected.length > 0 ? (
                            selected.map((j, index) => (
                                <div
                                    key={index}
                                    className="border border-indigo-200 bg-indigo-50 rounded-lg px-4 py-3"
                                >
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            <FaClock className="text-indigo-600 h-4 w-4" />
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <p className="text-sm font-medium text-gray-800">
                                                {formatTanggalIndo(j.tanggal, j.waktu)}
                                            </p>
                                            <div
                                                className="text-xs text-gray-600 mt-1"
                                                dangerouslySetInnerHTML={{
                                                    __html: j.keterangan,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-gray-400 mb-2">
                                    <FaCalendarDay className="h-12 w-12 mx-auto" />
                                </div>
                                <p className="text-sm text-gray-500">
                                    Belum ada jadwal yang dipilih
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Klik tombol "Absen" untuk memilih jadwal
                                </p>
                            </div>
                        )
                    ) : (
                        data.length > 0 ? (
                            data.map((j, index) => {
                                const isSelected = isJadwalSelected(j);
                                return (
                                    <label
                                        key={index}
                                        className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer transition ${
                                            isSelected
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:bg-gray-50"
                                        }`}
                                        onClick={() => toggleSelect(j)}
                                    >
                                        <div className="pr-3 max-w-[80%]">
                                            <p className="text-sm font-medium text-gray-800 break-words">
                                                {formatTanggalIndo(j.tanggal, j.waktu)}
                                            </p>
                                            <div
                                                className="text-xs text-gray-500 break-words"
                                                dangerouslySetInnerHTML={{
                                                    __html: j.keterangan,
                                                }}
                                            />
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleSelect(j)}
                                            className="text-blue-600 focus:ring-blue-500 flex-shrink-0"
                                        />
                                    </label>
                                );
                            })
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-4">
                                Tidak ada jadwal tersedia
                            </p>
                        )
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-6 sticky bottom-0 bg-white pt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
                    >
                        {mode === "view" ? "Tutup" : "Batal"}
                    </button>
                    {mode === "edit" && (
                        <button
                            onClick={() => {
                                if (selected.length > 0) {
                                    onSelect(selected);
                                    onClose();
                                }
                            }}
                            disabled={selected.length === 0}
                            className={`px-4 py-2 text-sm rounded-md text-white ${
                                selected.length > 0
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-blue-300 cursor-not-allowed"
                            }`}
                        >
                            Simpan
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalJadwal;