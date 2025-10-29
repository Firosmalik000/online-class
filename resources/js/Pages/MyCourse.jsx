import ModalJadwal from "@/Components/ModalJadwal";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { router, useForm } from "@inertiajs/react";
import React, { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import Swal from "sweetalert2";

const MyCourse = ({ kursus }) => {
    const [showModal, setShowModal] = useState(false);
    const [jadwalList, setJadwalList] = useState([]);
    const [showModalJadwal, setShowModalJadwal] = useState(false);
    const [selectedJadwal, setSelectedJadwal] = useState(null);

    const { post, put, processing } = useForm();


    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const openModal = (jadwal) => {
        setJadwalList(jadwal || []);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setJadwalList([]);
    };


    const cekAbsenKelas = (payload) => {
        const presensis = payload?.pendaftaran?.peserta?.presensis || [];

        // Cari semua presensi untuk kelas ini
        const daftarPresensi = presensis.filter(
            (presensi) => presensi.id_kelas === payload?.pendaftaran?.id_kelas
        );

        if (daftarPresensi.length > 0) {
            // Ambil presensi terakhir
            const presensiTerakhir = daftarPresensi[daftarPresensi.length - 1];
            const tanggalObj = new Date(
                presensiTerakhir.jadwal?.tanggal + "T" + presensiTerakhir.jadwal?.waktu
            );

            const tanggal = tanggalObj.toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });

            const waktu = tanggalObj.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
            });
            Swal.fire({
                icon: "info",
                title: "Sudah Memilih Jadwal",
                html: `
                <p style="margin-bottom: 6px;">Kamu sudah tidak bisa memilih jadwal lagi.</p>
                <p><strong>Jadwal yang sudah kamu pilih:</strong><br>${tanggal} pukul ${waktu}</p>
            `,
            });
        } else {
            setShowModalJadwal(true);
        }

    };

    const absensiKelas = async (jadwal, payload) => {
        try {
            const response = await router.post(
                route("presensi.store"),
                {
                    id_kelas: payload?.pendaftaran?.kelas?.id_kelas,
                    jadwal: jadwal,
                },
                {
                    onSuccess: () => {
                        Swal.fire({
                            icon: "success",
                            title: "Berhasil!",
                            text: "Absensi berhasil disimpan.",
                            timer: 1500,
                            showConfirmButton: false,
                        });
                    },
                    onError: (errors) => {
                        Swal.fire({
                            icon: "error",
                            title: "Gagal!",
                            text: "Terjadi kesalahan saat menyimpan absensi.",
                        });
                    },
                }
            );
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Terjadi error tak terduga.",
            });
        }
    };

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-semibold m-6 text-gray-800">
                Kursus Saya
            </h1>
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm uppercase tracking-wider">
                            <th className="py-3 px-5 text-left">No</th>
                            <th className="py-3 px-5 text-left">Nama Kelas</th>
                            <th className="py-3 px-5 text-left">Kategori</th>
                            <th className="py-3 px-5 text-left">Sesi</th>
                            <th className="py-3 px-5 text-left">Jadwal</th>
                            <th className="py-3 px-5 text-left">Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {kursus.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center py-6 text-gray-500"
                                >
                                    Belum ada kursus yang diikuti.
                                </td>
                            </tr>
                        ) : (
                            kursus.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-gray-50 transition duration-200 text-sm text-gray-700 border-b"
                                >
                                    <td className="py-3 px-5">{index + 1}</td>
                                    <td className="py-3 px-5 font-medium">
                                        {item.pendaftaran?.kelas?.nama_kelas ||
                                            "-"}
                                    </td>
                                    <td className="py-3 px-5">
                                        {item.pendaftaran?.kelas?.kategori ||
                                            "-"}
                                    </td>
                                    <td className="py-3 px-5">
                                        {item.pendaftaran?.kelas?.jadwal
                                            ? item.pendaftaran.kelas.jadwal.length
                                            : 0}
                                        <span className="ml-1 text-gray-400"> sesi</span>
                                    </td>
                                    <td className="py-3 px-5">
                                        <button
                                            type="button"
                                            onClick={() => cekAbsenKelas(item)}
                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                        >
                                            <FaCalendarAlt className="mr-1.5 h-3 w-3" />
                                            Pilih Jadwal
                                        </button>

                                        <ModalJadwal
                                            data={item?.pendaftaran?.kelas?.jadwal}
                                            show={showModalJadwal}
                                            onClose={() => setShowModalJadwal(false)}
                                            onSelect={(jadwal) => absensiKelas(jadwal, item)}
                                        />

                                    </td>
                                    <td className="py-3 px-5">
                                        {item.pendaftaran?.kelas?.link_zoom ? (
                                            <a
                                                href={
                                                    item.pendaftaran.kelas
                                                        .link_zoom
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-4 py-2 rounded-lg shadow transition duration-200"
                                            >
                                                Masuk Zoom
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 text-sm italic">
                                                Belum tersedia
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Jadwal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-40">
                    <div className="min-h-screen flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative max-h-[80vh] overflow-y-auto">
                            <h2 className="text-xl font-semibold mb-4">Jadwal Kelas</h2>
                            <button
                                onClick={closeModal}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            >
                                &times;
                            </button>
                            {jadwalList.length === 0 ? (
                                <div className="text-gray-500 text-center">Belum ada jadwal.</div>
                            ) : (
                                <ul className="space-y-4">
                                    {jadwalList.map((jadwal, idx) => (
                                        <li key={idx} className="border p-3 rounded">
                                            <div>
                                                <span className="font-medium">Tanggal:</span>{" "}
                                                {formatDate(jadwal.tanggal)}
                                            </div>
                                            <div>
                                                <span className="font-medium">Waktu:</span>{" "}
                                                {jadwal.waktu}
                                            </div>
                                            <div>
                                                <span className="font-medium mb-2">Deskripsi:</span>{" "}
                                                <br />
                                                <span dangerouslySetInnerHTML={{ __html: jadwal.keterangan || "N/A" }} />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default MyCourse;
