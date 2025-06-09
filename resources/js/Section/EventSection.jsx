import React from "react";
import { motion } from "framer-motion";
import { decodeHtml } from "@/Helpers/Decode";
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
    const filteredKelas = kelas?.data?.filter((event) => {
        const kategoriList = event?.kategori?.split(",") ?? [];

        const isKategoriMatch =
            filter === "semua" || kategoriList.includes(filter);

        const isSearchMatch =
            !search ||
            event.nama_kelas.toLowerCase().includes(search.toLowerCase());

        return isKategoriMatch && isSearchMatch;
    });

    const formatDate = (date) => {
        const options = { day: "numeric", month: "long", year: "numeric" };
        return new Date(date).toLocaleDateString("id-ID", options);
    };

    const formatHarga = (harga) => {
        return harga.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
        });
    };

    return (
        <section className="py-10 px-5 bg-gradient-to-b from-white to-gray-100">
            <h2 className="text-3xl font-bold text-center mb-10 text-blue-900">
                Pelatihan Web Development
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredKelas?.map((event, index) => (
                    <motion.div
                        key={event.id}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ delay: index * 0.15 }}
                    >
                        <img
                            src={"/storage/" + event.banner}
                            alt={event.nama_kelas}
                            className="w-full h-52 object-cover"
                        />
                        <div className="p-6">
                            <div className="h-[130px]">
                                <h3 className="text-2xl font-semibold text-blue-800">
                                    {event.nama_kelas}
                                </h3>
                                <div
                                    className="text-gray-600 mt-1 mb-3 line-clamp-3"
                                    dangerouslySetInnerHTML={{
                                        __html: event.deskripsi,
                                    }}
                                />
                            </div>

                            <div className="text-sm text-gray-700 space-y-1">
                                <div className="flex justify-between">
                                    <strong>Jadwal:</strong>{" "}
                                    {formatDate(event.jadwal)}
                                </div>
                                <div className="flex justify-between">
                                    <strong>Level:</strong> {event.level}
                                </div>
                                <div className="flex justify-between">
                                    <strong>Harga:</strong>{" "}
                                    {formatHarga(event.harga)}
                                </div>
                                <div className="flex justify-between">
                                    <strong>Pengajar:</strong>{" "}
                                    {event.pengajar.nama}
                                </div>
                                <div className="flex justify-between">
                                    <strong>Keahlian:</strong>{" "}
                                    {event.pengajar.keahlian}
                                </div>
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
                    </motion.div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-10 gap-2 flex-wrap">
                {kelas?.links?.map((link, index) => (
                    <Link
                        key={index}
                        href={link.url ?? "#"}
                        disabled={!link.url}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        className={`px-4 py-2 rounded text-sm
                            ${
                                link.active
                                    ? "bg-blue-600 text-white"
                                    : link.url
                                    ? "bg-white text-blue-600 border border-blue-400 hover:bg-blue-100"
                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            }
                        `}
                    />
                ))}
            </div>
        </section>
    );
};

export default EventSection;
