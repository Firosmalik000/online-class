import PengajarLayout from "@/Layouts/PengajarLayout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { FaCalendarAlt, FaClock, FaVideo, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Jadwal({ pengajar, jadwalList }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [view, setView] = useState('list'); // 'list' or 'calendar'

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const isToday = (dateStr) => {
        const today = new Date();
        const date = new Date(dateStr);
        return today.toDateString() === date.toDateString();
    };

    const isPast = (dateStr) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const date = new Date(dateStr);
        return date < today;
    };

    const isFuture = (dateStr) => {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        const date = new Date(dateStr);
        return date > today;
    };

    // Group jadwal by date status
    const todayJadwal = jadwalList.filter(j => isToday(j.tanggal));
    const upcomingJadwal = jadwalList.filter(j => isFuture(j.tanggal));
    const pastJadwal = jadwalList.filter(j => isPast(j.tanggal));

    // Calendar helpers
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        return { daysInMonth, startingDay };
    };

    const getJadwalForDate = (day) => {
        const targetDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        return jadwalList.filter(j => {
            const jadwalDate = new Date(j.tanggal);
            return jadwalDate.toDateString() === targetDate.toDateString();
        });
    };

    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    return (
        <PengajarLayout pengajar={pengajar}>
            <Head title="Jadwal Mengajar" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Jadwal Mengajar</h1>
                        <p className="text-gray-500 mt-1">Lihat jadwal mengajar Anda</p>
                    </div>

                    {/* View Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setView('list')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                view === 'list' ? 'bg-white shadow text-indigo-600' : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Daftar
                        </button>
                        <button
                            onClick={() => setView('calendar')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                view === 'calendar' ? 'bg-white shadow text-indigo-600' : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Kalender
                        </button>
                    </div>
                </div>

                {view === 'list' ? (
                    <div className="space-y-6">
                        {/* Today's Schedule */}
                        {todayJadwal.length > 0 && (
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <FaCalendarAlt /> Jadwal Hari Ini
                                </h2>
                                <div className="space-y-3">
                                    {todayJadwal.map((jadwal, idx) => (
                                        <div key={idx} className="bg-white/20 backdrop-blur rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-semibold">{jadwal.nama_kelas}</p>
                                                    <p className="text-sm text-indigo-100 flex items-center gap-2 mt-1">
                                                        <FaClock className="w-4 h-4" />
                                                        {jadwal.waktu?.substring(0, 5)} WIB
                                                    </p>
                                                </div>
                                                {jadwal.link_zoom && (
                                                    <a
                                                        href={jadwal.link_zoom}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                                                    >
                                                        <FaVideo /> Join
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upcoming Schedule */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-800">Jadwal Mendatang</h2>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {upcomingJadwal.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        Tidak ada jadwal mendatang
                                    </div>
                                ) : (
                                    upcomingJadwal.map((jadwal, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                                            <div className="bg-indigo-100 rounded-lg p-3 text-center min-w-[70px]">
                                                <p className="text-xs text-indigo-600 font-medium">
                                                    {new Date(jadwal.tanggal).toLocaleDateString("id-ID", { weekday: "short" })}
                                                </p>
                                                <p className="text-2xl font-bold text-indigo-700">
                                                    {new Date(jadwal.tanggal).getDate()}
                                                </p>
                                                <p className="text-xs text-indigo-600">
                                                    {new Date(jadwal.tanggal).toLocaleDateString("id-ID", { month: "short" })}
                                                </p>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800">{jadwal.nama_kelas}</p>
                                                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                    <FaClock className="w-3 h-3" />
                                                    {jadwal.waktu?.substring(0, 5)} WIB
                                                </p>
                                            </div>
                                            <Link
                                                href={route("pengajar.kelas.detail", jadwal.id_kelas)}
                                                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                                            >
                                                Lihat Kelas
                                            </Link>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Past Schedule */}
                        {pastJadwal.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="p-6 border-b border-gray-100">
                                    <h2 className="text-lg font-semibold text-gray-800">Jadwal Sebelumnya</h2>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {pastJadwal.slice(0, 10).map((jadwal, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 opacity-60">
                                            <div className="bg-gray-100 rounded-lg p-3 text-center min-w-[70px]">
                                                <p className="text-xs text-gray-500 font-medium">
                                                    {new Date(jadwal.tanggal).toLocaleDateString("id-ID", { weekday: "short" })}
                                                </p>
                                                <p className="text-2xl font-bold text-gray-600">
                                                    {new Date(jadwal.tanggal).getDate()}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(jadwal.tanggal).toLocaleDateString("id-ID", { month: "short" })}
                                                </p>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-600">{jadwal.nama_kelas}</p>
                                                <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                                                    <FaClock className="w-3 h-3" />
                                                    {jadwal.waktu?.substring(0, 5)} WIB
                                                </p>
                                            </div>
                                            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                                                Selesai
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Calendar View */
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        {/* Calendar Header */}
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={prevMonth}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FaChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <h2 className="text-xl font-semibold text-gray-800">
                                {currentMonth.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
                            </h2>
                            <button
                                onClick={nextMonth}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FaChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {/* Day headers */}
                            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                                <div key={day} className="text-center py-2 text-sm font-medium text-gray-500">
                                    {day}
                                </div>
                            ))}

                            {/* Empty cells for days before month starts */}
                            {[...Array(startingDay)].map((_, i) => (
                                <div key={`empty-${i}`} className="aspect-square p-1" />
                            ))}

                            {/* Day cells */}
                            {[...Array(daysInMonth)].map((_, i) => {
                                const day = i + 1;
                                const dayJadwal = getJadwalForDate(day);
                                const targetDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                const isCurrentDay = targetDate.toDateString() === new Date().toDateString();

                                return (
                                    <div
                                        key={day}
                                        className={`aspect-square p-1 border rounded-lg ${
                                            isCurrentDay ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100'
                                        }`}
                                    >
                                        <div className="h-full flex flex-col">
                                            <span className={`text-sm font-medium ${
                                                isCurrentDay ? 'text-indigo-600' : 'text-gray-700'
                                            }`}>
                                                {day}
                                            </span>
                                            <div className="flex-1 overflow-hidden">
                                                {dayJadwal.slice(0, 2).map((j, jIdx) => (
                                                    <div
                                                        key={jIdx}
                                                        className="text-xs bg-indigo-100 text-indigo-700 rounded px-1 py-0.5 truncate mt-0.5"
                                                        title={j.nama_kelas}
                                                    >
                                                        {j.nama_kelas}
                                                    </div>
                                                ))}
                                                {dayJadwal.length > 2 && (
                                                    <div className="text-xs text-gray-500 mt-0.5">
                                                        +{dayJadwal.length - 2} lagi
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </PengajarLayout>
    );
}
