import React from "react";
import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";

const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

const EventSection = ({ kelas, filter, search }) => {
    const filteredKelas =
        kelas?.data?.filter((event) => {
            const kategoriList = event?.kategori?.split(",") ?? [];
            const isKategoriMatch =
                filter === "semua" || kategoriList.includes(filter);
            const isSearchMatch =
                !search ||
                event.nama_kelas.toLowerCase().includes(search.toLowerCase());
            return isKategoriMatch && isSearchMatch;
        }) || kelas;

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

    const formatHarga = (harga) =>
        harga.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
        });

    return (
        <section className="py-6 bg-gradient-to-b from-white to-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredKelas?.map((event, index) => (
                    <motion.div
                        key={index}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <img
                            src={`/storage/${event.banner}`}
                            alt={event.nama_kelas}
                            className="w-full h-52 object-cover"
                        />
                        <div className="p-6 flex flex-col justify-between h-[310px] mb-3">
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-blue-800 mb-2">
                                    {event.nama_kelas}
                                </h3>
                                <div
                                    className="text-gray-600 text-sm line-clamp-3"
                                    dangerouslySetInnerHTML={{
                                        __html: event.deskripsi,
                                    }}
                                />
                            </div>

                            <div className="text-sm text-gray-700 space-y-1">
                                <p>
                                    <strong>Jadwal:</strong>{" "}
                                    {formatDate(event.jadwal)}
                                </p>
                                <p>
                                    <strong>Level:</strong> {event.level}
                                </p>
                                <p>
                                    <strong>Harga:</strong>{" "}
                                    {formatHarga(event.harga)}
                                </p>
                                <p>
                                    <strong>Pengajar:</strong>{" "}
                                    {event.pengajar.nama}
                                </p>
                                <p>
                                    <strong>Keahlian:</strong>{" "}
                                    {event.pengajar.keahlian}
                                </p>
                            </div>

                            <Link href={`/detail/${event.id_kelas}`}>
                                <button className="mt-5 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
                                    Lihat Detail
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>

            {kelas?.links && (
                <div className="flex justify-center mt-10 gap-2 flex-wrap">
                    {kelas.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url ?? "#"}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-4 py-2 rounded text-sm
                                ${link.active
                                    ? "bg-blue-600 text-white"
                                    : link.url
                                        ? "bg-white text-blue-600 border border-blue-400 hover:bg-blue-100"
                                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                }
                            `}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default EventSection;
