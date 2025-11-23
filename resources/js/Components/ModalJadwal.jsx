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
        if (show) {
            setSelected(selectedDefault);
        } else {
            setSelected([]);
        }
    }, [show, selectedDefault]);

    if (!show) return null;

    // tandai mana jadwal yg sudah absen
    const listToRender = data.map(j => {
        const sudahAbsen = selectedDefault.some(s => s?.id === j.id);
        return { ...j, sudahAbsen };
    });

    const isPast = (tanggalStr, waktuStr) => {
        const dateOnly = tanggalStr.split("T")[0];
        const dateTime = new Date(`${dateOnly}T${waktuStr}`);
        return dateTime < new Date();
    };

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

    const isJadwalSelected = (j) => selected.some(s => s.id === j.id);

    const toggleSelect = (jadwal) => {
        if (mode === "view") return;
        if (jadwal.sudahAbsen) return; // tidak bisa diubah

        setSelected(prev => {
            const exists = prev.some(s => s.id === jadwal.id);
            return exists
                ? prev.filter(s => s.id !== jadwal.id)
                : [...prev, jadwal];
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
                    {listToRender.map(j => {
                        const isSelected = isJadwalSelected(j);
                        const isExpired = isPast(j.tanggal, j.waktu);

                        return (
                            <div
                                key={j.id}
                                className={`
                                    flex items-center justify-between border rounded-lg px-4 py-3 transition
                                    ${
                                        j.sudahAbsen
                                            ? "bg-green-100 border-green-400 cursor-not-allowed"
                                            : isExpired
                                            ? "bg-gray-200 border-gray-300 opacity-60 cursor-not-allowed"
                                            : isSelected
                                            ? "border-blue-500 bg-blue-50 cursor-pointer"
                                            : "border-gray-200 hover:bg-gray-50 cursor-pointer"
                                    }
                                `}
                                onClick={() => !isExpired && !j.sudahAbsen && toggleSelect(j)}
                            >
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
                                                    dangerouslySetInnerHTML={{ __html: m.materi.content }}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {j.sudahAbsen && (
                                        <p className="text-xs text-green-700 font-semibold mt-1">
                                            ✔ Sudah Absen
                                        </p>
                                    )}
                                </div>

                                {mode === "edit" && (
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        disabled={isExpired || j.sudahAbsen}
                                        onChange={() => !isExpired && !j.sudahAbsen && toggleSelect(j)}
                                        className="text-blue-600 flex-shrink-0"
                                    />
                                )}
                            </div>
                        );
                    })}
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
                            className="px-4 py-2 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700"
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
