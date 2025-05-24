import { Link } from "@inertiajs/react";
import React from "react";

const EventSection = ({ kelas, filter }) => {
    const filteredKelas = kelas?.filter((event) => {
        const kategoriList = event?.kategori.split(",");
        return filter !== "semua" ? kategoriList?.includes(filter) : kelas;
    });
    return (
        <section className="py-10 px-5 bg-gradient-to-b from-white to-gray-100">
            <h2 className="text-3xl font-bold text-center mb-10 text-blue-900">
                Pelatihan Web Development
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredKelas?.map((event) => (
                    <div
                        key={event.id}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
                    >
                        <img
                            src={"/storage/" + event.banner}
                            alt={event.nama_kelas}
                            className="w-full h-52 object-cover"
                        />
                        <div className="p-6">
                            <h3 className="text-2xl font-semibold text-blue-800">
                                {event.nama_kelas}
                            </h3>
                            <p className="text-gray-600 mt-1 mb-3">
                                {event.deskripsi}
                            </p>
                            <div className="text-sm text-gray-700 space-y-1">
                                <p>
                                    <strong>Jadwal:</strong>{" "}
                                    {new Date(event.jadwal).toLocaleString()}
                                </p>
                                <p>
                                    <strong>Level:</strong> {event.level}
                                </p>

                                <p>
                                    <strong>Harga:</strong> Rp{" "}
                                    {event.harga.toLocaleString()}
                                </p>
                                <p>
                                    <strong>Pengajar:</strong>{" "}
                                    {event.pengajar.nama} (
                                    {event.pengajar.keahlian})
                                </p>
                            </div>

                            <a
                                href={event.link_zoom}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Link href={`/detail/${event.id_kelas}`}>
                                    <button className="mt-5 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded flex items-center justify-center">
                                        Lihat Detail
                                    </button>
                                </Link>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default EventSection;
