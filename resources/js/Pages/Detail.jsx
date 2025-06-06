import React, { useRef } from "react";
import WelcomeLayout from "@/Layouts/WelcomeLayout";
import { FaUser } from "react-icons/fa";
import { useForm } from "@inertiajs/react";
import Swal from "sweetalert2";

const Detail = ({ kelas }) => {
    // Gunakan kelas.id sebagai parameter untuk route
    const { data, post, processing, errors, reset } = useForm({
        kelas_id: kelas.id_kelas // Pastikan ini sesuai dengan field yang diharapkan di Laravel
    });

    const submit = (e) => {
        e.preventDefault();

        // Gunakan kelas.id sebagai parameter route, bukan data.id
        post(route("order.store", kelas.id_kelas), {
            data: data, // Kirim data form sebagai body request
            onSuccess: (page) => {
                Swal.fire("Berhasil!", "Pendaftaran berhasil.", "success");
                if (page.props.pendaftaran_id) {
                    window.location.href = route("order.detail", page.props.pendaftaran_id);
                } else {
                    console.warn("pendaftaran_id tidak ditemukan di respons.");
                }
                reset(); // Reset form setelah berhasil
            },
            onError: (formErrors) => {
                let errorMessage = "Terjadi kesalahan.";
                if (Object.keys(formErrors).length > 0) {
                    errorMessage = Object.values(formErrors).join("\n");
                }
                Swal.fire("Error", errorMessage, "error");
            }
        });
    };

    return (
        <WelcomeLayout>
            <section className="min-h-screen px-6 lg:px-24 py-16 text-gray-800">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Kiri - Konten utama */}
                    <div className="w-full lg:w-2/3">
                        <h1 className="text-3xl font-bold mb-4">
                            {kelas.nama_kelas}
                        </h1>

                        {/* Banner */}
                        <img
                            src={"/storage/" + kelas.banner}
                            alt={kelas.nama_kelas}
                            className="w-full h-64 object-cover rounded-xl mb-6"
                        />

                        {/* Deskripsi */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">
                                Description
                            </h2>
                            <p className="text-justify leading-relaxed">
                                {kelas.deskripsi}
                            </p>
                        </div>

                        {/* Pengajar */}
                        <div className="border p-4 rounded-xl shadow-sm">
                            <h2 className="text-lg font-semibold mb-3">
                                Pengajar
                            </h2>
                            <div className="flex items-center gap-4">
                                {kelas.pengajar.foto === null ? (
                                    <FaUser className="text-3xl text-gray-600" />
                                ) : (
                                    <img
                                        src={"/storage/" + kelas.pengajar.foto}
                                        alt={kelas.pengajar.nama}
                                        className="w-16 h-16 object-cover rounded-full"
                                    />
                                )}

                                <div>
                                    <p className="font-semibold">
                                        {kelas.pengajar.nama}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {kelas.pengajar.keahlian}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kanan - Info Harga */}
                    <div className="w-full lg:w-1/3">
                        <form onSubmit={submit}>
                            <div className="border rounded-xl p-6 shadow-md">
                                <h3 className="text-2xl font-bold text-right mb-6">
                                    Rp{kelas.harga.toLocaleString("id-ID")},00
                                </h3>

                                <div className="space-y-4 text-sm text-gray-700">
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="font-medium">Jadwal</span>
                                        <span>
                                            {new Date(
                                                kelas.jadwal
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
                                        <span>{kelas.kategori}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="font-medium">Level</span>
                                        <span>{kelas.level}</span>
                                    </div>
                                    <div className="flex justify-between pb-2">
                                        <span className="font-medium">
                                            Jumlah Peserta
                                        </span>
                                        <span>123</span> {/* Sesuaikan dengan data riil */}
                                    </div>
                                </div>

                                {/* Tombol Daftar */}
                                <button
                                    type="submit"
                                    className="mt-6 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
                                    disabled={processing}
                                >
                                    {processing ? "Memproses..." : "Daftar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </WelcomeLayout>
    );
};

export default Detail;