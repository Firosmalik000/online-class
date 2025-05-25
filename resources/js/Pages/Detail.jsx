import React from "react";
import WelcomeLayout from "@/Layouts/WelcomeLayout";
import { FaUser } from "react-icons/fa";
import { Link } from "@inertiajs/react";

const Detail = ({ kelas }) => {
    const data = kelas;
    console.log({ kelas });
    return (
        <WelcomeLayout>
            <section className="min-h-screen px-6 lg:px-24 py-16 text-gray-800">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Kiri - Konten utama */}
                    <div className="w-full lg:w-2/3">
                        <h1 className="text-3xl font-bold mb-4">
                            {data.nama_kelas}
                        </h1>

                        {/* Banner */}
                        <img
                            src={"/storage/" + data.banner}
                            alt={data.nama_kelas}
                            className="w-full h-64 object-cover rounded-xl mb-6"
                        />

                        {/* Deskripsi */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">
                                Description
                            </h2>
                            <p className="text-justify leading-relaxed">
                                {data.deskripsi}
                            </p>
                        </div>

                        {/* Pengajar */}
                        <div className="border p-4 rounded-xl shadow-sm">
                            <h2 className="text-lg font-semibold mb-3">
                                Pengajar
                            </h2>
                            <div className="flex items-center gap-4">
                                {data.pengajar.foto === null ? (
                                    <FaUser className="text-3xl text-gray-600" />
                                ) : (
                                    <img
                                        src={"/storage/" + data.pengajar.foto}
                                        alt={data.pengajar.nama}
                                        className="w-16 h-16 object-cover rounded-full"
                                    />
                                )}

                                <div>
                                    <p className="font-semibold">
                                        {data.pengajar.nama}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {data.pengajar.keahlian}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kanan - Info Harga */}
                    <div className="w-full lg:w-1/3">
                        <div className="border rounded-xl p-6 shadow-md">
                            <h3 className="text-2xl font-bold text-right mb-6">
                                Rp{data.harga.toLocaleString("id-ID")},00
                            </h3>

                            <div className="space-y-4 text-sm text-gray-700">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-medium">Jadwal</span>
                                    <span>
                                        {new Date(
                                            data.jadwal
                                        ).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-medium">
                                        Kategori
                                    </span>
                                    <span>{data.kategori}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="font-medium">Level</span>
                                    <span>{data.level}</span>
                                </div>
                                <div className="flex justify-between pb-2">
                                    <span className="font-medium">
                                        Jumlah Peserta
                                    </span>
                                    <span>123</span>
                                </div>
                            </div>

                            {/* Tombol Daftar */}
                            <a
                                // href={route("order", data.id)}
                                href={"/order"}
                            >
                                <button className="mt-6 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition">
                                    Daftar
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </WelcomeLayout>
    );
};

export default Detail;
