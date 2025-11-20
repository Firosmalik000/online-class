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


    const isPast = (tanggalStr, waktuStr) => {
        const dateOnly = tanggalStr.split("T")[0];
        const dateTime = new Date(`${dateOnly}T${waktuStr}`);

        return dateTime < new Date(); // TRUE jika waktu sudah lewat
    };


    // FIX INVALID DATE
    const formatTanggalIndo = (tanggalStr, waktuStr) => {
        const dateOnly = tanggalStr.split("T")[0];
        const dateTime = new Date(`${dateOnly}T${waktuStr}`);

        return new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(dateTime);
    };

    const isJadwalSelected = (jadwal) => {
        return selected.some((s) => s.id === jadwal.id);
    };

    const toggleSelect = (jadwal) => {
        if (mode === "view") return;

        setSelected((prev) => {
            const exists = prev.some((s) => s.id === jadwal.id);
            return exists
                ? prev.filter((s) => s.id !== jadwal.id)
                : [...prev, jadwal];
        });
    };

    const listToRender = mode === "view" ? selectedDefault : data;




    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaCalendarDay className="mr-2 text-indigo-600" />
                    {mode === "view" ? "Jadwal Saya" : "Pilih Jadwal"}
                </h2>
                <div className="space-y-3">
                    {listToRender.length > 0 ? (
                        listToRender.map((j) => {
                            const isSelected = isJadwalSelected(j);
                            const isExpired = isPast(j.tanggal, j.waktu);

                            return (
                                <label
                                    key={j.id}
                                    className={`
                        flex items-center justify-between border rounded-lg px-4 py-3 transition
                        ${isExpired
                                            ? "bg-gray-200 border-gray-300 opacity-60 cursor-not-allowed"
                                            : isSelected
                                                ? "border-blue-500 bg-blue-50 cursor-pointer"
                                                : "border-gray-200 hover:bg-gray-50 cursor-pointer"
                                        }
                    `}
                                    onClick={() => !isExpired && toggleSelect(j)}
                                >
                                    {/* label expired */}
                                    {isExpired && (
                                        <span className="text-xs text-red-600 font-semibold ml-2">
                                            (Sudah lewat)
                                        </span>
                                    )}

                                    {/* tanggal & materi */}
                                    <div className="pr-3 max-w-[80%]">
                                        <p className="text-sm font-medium text-gray-800 break-words">
                                            {formatTanggalIndo(j.tanggal, j.waktu)}
                                        </p>

                                        {j.materi?.length > 0 && (
                                            <div className="mt-1 space-y-1">
                                                {j.materi.map((m) => (
                                                    <div
                                                        key={m.id}
                                                        className="text-xs text-gray-600"
                                                        dangerouslySetInnerHTML={{
                                                            __html: m.materi.content,
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        disabled={isExpired || mode === "view"}
                                        onChange={() => !isExpired && toggleSelect(j)}
                                        className="text-blue-600 focus:ring-blue-500 flex-shrink-0"
                                    />
                                </label>
                            );
                        })
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-4">
                            Tidak ada jadwal tersedia
                        </p>
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
                                onSelect(selected);
                                onClose();
                            }}
                            disabled={selected.length === 0}
                            className={`px-4 py-2 text-sm rounded-md text-white ${selected.length > 0
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
