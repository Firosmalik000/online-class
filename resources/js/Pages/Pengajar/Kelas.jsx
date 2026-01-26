import PengajarLayout from "@/Layouts/PengajarLayout";
import { Head, Link } from "@inertiajs/react";
import { FaUsers, FaCalendarAlt, FaFileAlt, FaEye, FaTag } from "react-icons/fa";


export default function Kelas({ pengajar, kelasList }) {
    const getStatusKelas = (kelas) => {
        if (!kelas.jadwal || kelas.jadwal.length === 0) {
            return { label: "Tidak Ada Jadwal", class: "bg-gray-100 text-gray-600" };
        }

        const now = new Date();
        const jadwalSorted = [...kelas.jadwal].sort((a, b) => {
            const dateA = new Date(`${a.tanggal}T${a.waktu}`);
            const dateB = new Date(`${b.tanggal}T${b.waktu}`);
            return dateA - dateB;
        });

        const jadwalPertama = jadwalSorted[0];
        const jadwalTerakhir = jadwalSorted[jadwalSorted.length - 1];

        const waktuMulai = new Date(`${jadwalPertama.tanggal.split('T')[0]}T${jadwalPertama.waktu}`);
        const waktuSelesai = new Date(`${jadwalTerakhir.tanggal.split('T')[0]}T${jadwalTerakhir.waktu}`);
        waktuSelesai.setHours(waktuSelesai.getHours() + 2);

        if (now < waktuMulai) {
            return { label: "Belum Mulai", class: "bg-yellow-100 text-yellow-700" };
        } else if (now >= waktuMulai && now <= waktuSelesai) {
            return { label: "Sedang Berlangsung", class: "bg-blue-100 text-blue-700" };
        } else {
            return { label: "Selesai", class: "bg-green-100 text-green-700" };
        }
    };

    return (
        <PengajarLayout pengajar={pengajar}>
            <Head title="Kelas Saya" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Kelas Saya</h1>
                    <p className="text-gray-500 mt-1">Kelola kelas yang telah ditugaskan kepada Anda</p>
                </div>

                {kelasList.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <FaFileAlt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Belum ada kelas yang ditugaskan</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {kelasList.map((kelas) => {
                            const status = getStatusKelas(kelas);
                            const totalSiswa = kelas.pendaftaran?.filter(p => p.status === 'aktif').length || 0;
                            const totalJadwal = kelas.jadwal?.length || 0;
                            const totalMateri = kelas.jadwal?.reduce((acc, j) => acc + (j.materi?.materi?.length || 0), 0) || 0;

                            return (
                                <div
                                    key={kelas.id_kelas}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    <div className="relative">
                                        <img
                                            src={kelas.banner ? `/storage/${kelas.banner}` : '/Image/default-course.jpg'}
                                            alt={kelas.nama_kelas}
                                            className="w-full h-40 object-cover"
                                        />
                                        <span className={`absolute top-3 right-3 px-3 py-1 text-xs font-medium rounded-full ${status.class}`}>
                                            {status.label}
                                        </span>
                                    </div>

                                    <div className="p-5">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-semibold text-gray-800 text-lg line-clamp-2">
                                                {kelas.nama_kelas}
                                            </h3>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {kelas.kategori ? (
                                                typeof kelas.kategori === 'string'
                                                    ? kelas.kategori.split(',').map((cat, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-200"
                                                        >
                                                            <FaTag className="w-2.5 h-2.5" />
                                                            {cat.trim()}
                                                        </span>
                                                    ))
                                                    : kelas.kategori.map((cat, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-200"
                                                        >
                                                            <FaTag className="w-2.5 h-2.5" />
                                                            {cat}
                                                        </span>
                                                    ))
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                                                    <FaTag className="w-2.5 h-2.5" />
                                                    Belum ada kategori
                                                </span>
                                            )}
                                        </div>


                                        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                                            <div dangerouslySetInnerHTML={{ __html: kelas.deskripsi }}></div>
                                        </p>

                                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                            <div className="flex items-center gap-1">
                                                <FaUsers className="w-4 h-4" />
                                                <span>{totalSiswa} siswa</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FaCalendarAlt className="w-4 h-4" />
                                                <span>{totalJadwal} sesi</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FaFileAlt className="w-4 h-4" />
                                                <span>{totalMateri} materi</span>
                                            </div>
                                        </div>

                                        <Link
                                            href={route("pengajar.kelas.detail", kelas.id_kelas)}
                                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                        >
                                            <FaEye className="w-4 h-4" />
                                            Lihat Detail
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </PengajarLayout>
    );
}
