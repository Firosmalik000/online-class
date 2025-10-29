import React, { useEffect, useState } from "react";

const ModalJadwal = ({ show, data = [], onClose, onSelect }) => {
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        if (!show) {
            setSelected(null);
        }
    }, [show]);

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

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div
                className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative 
                           max-h-[90vh] overflow-y-auto"
            >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Pilih Jadwal
                </h2>

                <div className="space-y-3">
                    {data.length > 0 ? (
                        data.map((j, index) => (
                            <label
                                key={index}
                                className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer transition ${
                                    selected === index
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 hover:bg-gray-50"
                                }`}
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
                                    type="radio"
                                    name="jadwal"
                                    checked={selected === index}
                                    onChange={() => setSelected(index)}
                                    className="text-blue-600 focus:ring-blue-500 flex-shrink-0"
                                />
                            </label>
                        ))
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
                        Batal
                    </button>
                    <button
                        onClick={() => {
                            const jadwalTerpilih = data[selected];
                            if (jadwalTerpilih) {
                                onSelect(jadwalTerpilih);
                                onClose();
                            }
                        }}
                        disabled={selected === null}
                        className={`px-4 py-2 text-sm rounded-md text-white ${
                            selected !== null
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-blue-300 cursor-not-allowed"
                        }`}
                    >
                        Pilih
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalJadwal;
