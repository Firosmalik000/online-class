import ModalJadwal from "@/Components/ModalJadwal";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { router, useForm } from "@inertiajs/react";
import React, { useState } from "react";
import { FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2";

const MyCourse = ({ kursus }) => {
    const [showModalJadwal, setShowModalJadwal] = useState(false);
    const [selectedKelas, setSelectedKelas] = useState(null);
    const [modalMode, setModalMode] = useState("edit");

    console.log(kursus);

    const { post } = useForm();

    const formatTanggalIndo = (tanggalStr, waktuStr) => {
        const tanggal = new Date(tanggalStr);
        return new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(tanggal) + ` • ${waktuStr}`;
    };

    const openAbsenModal = (item) => {
        setSelectedKelas(item);
        setModalMode("edit");
        setShowModalJadwal(true);
    };

    // Fungsi untuk buka modal lihat jadwal
    const openViewJadwalModal = (item) => {
        setSelectedKelas(item);
        setModalMode("view");
        setShowModalJadwal(true);
    };


    const absensiKelas = async (jadwalsArray, payload) => {
        const listIdJadwal = jadwalsArray.map(j => j.id);

        try {
            await router.post(
                route("presensi.store"),
                {
                    id_kelas: payload?.pendaftaran?.kelas?.id_kelas,
                    id_jadwal: listIdJadwal,
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
                        setShowModalJadwal(false);
                    },
                    onError: () => {
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
                            <th className="py-3 px-5 text-center">Jadwal</th>
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
                                        {item.pendaftaran?.kelas?.nama_kelas || "-"}
                                    </td>
                                    <td className="py-3 px-5">
                                        {item.pendaftaran?.kelas?.kategori || "-"}
                                    </td>
                                    <td className="py-3 px-5">
                                        {item.pendaftaran?.kelas?.jadwal
                                            ? item.pendaftaran.kelas.jadwal.length
                                            : 0}
                                        <span className="ml-1 text-gray-400">sesi</span>
                                    </td>
                                    <td className="py-3 px-5">
                                        <div className="flex space-x-2 justify-center">
                                            <button
                                                type="button"
                                                onClick={() => openAbsenModal(item)}
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                                            >
                                                <FaCheckCircle className="mr-1.5 h-3 w-3" />
                                                Absen
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => openViewJadwalModal(item)}
                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                            >
                                                <FaCalendarAlt className="mr-1.5 h-3 w-3" />
                                                Jadwal Saya
                                            </button>
                                        </div>
                                    </td>
                                    <td className="py-3 px-5">
                                        {item.pendaftaran?.kelas?.link_zoom ? (
                                            <a
                                                href={item.pendaftaran.kelas.link_zoom}
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

            <ModalJadwal
                show={showModalJadwal}
                mode={modalMode}
                data={selectedKelas?.pendaftaran?.kelas?.jadwal || []}
                selected={
                    selectedKelas?.pendaftaran?.peserta?.presensis
                        ?.filter(p => p.id_kelas === selectedKelas?.pendaftaran?.id_kelas)
                        ?.map(p =>
                            selectedKelas?.pendaftaran?.kelas?.jadwal?.find(j => j.id === p.id_jadwal)
                        )
                        ?.filter(Boolean) || []
                }
                onClose={() => setShowModalJadwal(false)}
                onSelect={(jadwals) => {
                    absensiKelas(jadwals, selectedKelas);
                }}
            />
        </DashboardLayout>
    );
};

export default MyCourse;