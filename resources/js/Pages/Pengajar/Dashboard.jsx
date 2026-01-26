import PengajarLayout from "@/Layouts/PengajarLayout";
import { Head, Link } from "@inertiajs/react";
import { FaBook, FaUsers, FaCalendarAlt, FaChevronRight } from "react-icons/fa";

export default function Dashboard({ pengajar, kelasList, stats }) {
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // Get upcoming jadwal
    const getUpcomingJadwal = () => {
        const now = new Date();
        const allJadwal = [];
        
        kelasList.forEach(kelas => {
            kelas.jadwal?.forEach(jadwal => {
                const jadwalDate = new Date(`${jadwal.tanggal}T${jadwal.waktu}`);
                if (jadwalDate >= now) {
                    allJadwal.push({
                        ...jadwal,
                        nama_kelas: kelas.nama_kelas,
                        id_kelas: kelas.id_kelas,
                    });
                }
            });
        });

        return allJadwal
            .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal))
            .slice(0, 5);
    };

    const upcomingJadwal = getUpcomingJadwal();

    return (
        <PengajarLayout pengajar={pengajar}>
            <Head title="Dashboard Pengajar" />

            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
                    <h1 className="text-2xl font-bold">
                        Selamat Datang, {pengajar?.nama || "Pengajar"}! 👋
                    </h1>
                    <p className="mt-2 text-indigo-100">
                        Kelola kelas dan materi pembelajaran Anda dari sini.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Kelas</p>
                                <p className="text-3xl font-bold text-gray-800">{stats.totalKelas}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <FaBook className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Siswa</p>
                                <p className="text-3xl font-bold text-gray-800">{stats.totalSiswa}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <FaUsers className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Jadwal</p>
                                <p className="text-3xl font-bold text-gray-800">{stats.totalJadwal}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <FaCalendarAlt className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Kelas Terbaru */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-800">Kelas Saya</h2>
                                <Link 
                                    href={route("pengajar.kelas")}
                                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
                                >
                                    Lihat Semua <FaChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {kelasList.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    Belum ada kelas yang ditugaskan
                                </div>
                            ) : (
                                kelasList.slice(0, 4).map((kelas) => (
                                    <Link
                                        key={kelas.id_kelas}
                                        href={route("pengajar.kelas.detail", kelas.id_kelas)}
                                        className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <img
                                            src={kelas.banner ? `/storage/${kelas.banner}` : '/Image/default-course.jpg'}
                                            alt={kelas.nama_kelas}
                                            className="w-16 h-12 rounded-lg object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-800 truncate">
                                                {kelas.nama_kelas}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {kelas.pendaftaran?.filter(p => p.status === 'aktif').length || 0} siswa aktif
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            kelas.level === 'pemula' ? 'bg-green-100 text-green-700' :
                                            kelas.level === 'menengah' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {kelas.level}
                                        </span>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Jadwal Mendatang */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-800">Jadwal Mendatang</h2>
                                <Link 
                                    href={route("pengajar.jadwal")}
                                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
                                >
                                    Lihat Semua <FaChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {upcomingJadwal.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    Tidak ada jadwal mendatang
                                </div>
                            ) : (
                                upcomingJadwal.map((jadwal, index) => (
                                    <div
                                        key={`${jadwal.id}-${index}`}
                                        className="flex items-center gap-4 p-4"
                                    >
                                        <div className="bg-indigo-100 rounded-lg p-3 text-center min-w-[60px]">
                                            <p className="text-xs text-indigo-600 font-medium">
                                                {new Date(jadwal.tanggal).toLocaleDateString("id-ID", { weekday: "short" })}
                                            </p>
                                            <p className="text-xl font-bold text-indigo-700">
                                                {new Date(jadwal.tanggal).getDate()}
                                            </p>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800">{jadwal.nama_kelas}</p>
                                            <p className="text-sm text-gray-500">
                                                {jadwal.waktu?.substring(0, 5)} WIB
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PengajarLayout>
    );
}
