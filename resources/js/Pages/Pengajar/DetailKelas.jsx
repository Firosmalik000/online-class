import PengajarLayout from "@/Layouts/PengajarLayout";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import {
    FaUsers,
    FaCalendarAlt,
    FaFileAlt,
    FaUpload,
    FaTrash,
    FaDownload,
    FaArrowLeft,
    FaLink,
    FaFilePdf,
    FaTag
} from "react-icons/fa";
import Swal from "sweetalert2";

export default function DetailKelas({ pengajar, kelas }) {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedJadwal, setSelectedJadwal] = useState(null);
    const [uploading, setUploading] = useState(false);


    const { data, setData, post, processing, errors, reset } = useForm({
        id_jadwal: '',
        judul: '',
        file: null,
    });

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const openUploadModal = (jadwal) => {
        setSelectedJadwal(jadwal);
        setData('id_jadwal', jadwal.id);
        setShowUploadModal(true);
    };

    const closeUploadModal = () => {
        setShowUploadModal(false);
        setSelectedJadwal(null);
        reset();
    };

    const handleUpload = (e) => {
        e.preventDefault();
        setUploading(true);

        const formData = new FormData();
        formData.append('id_jadwal', data.id_jadwal);
        formData.append('judul', data.judul);
        formData.append('file', data.file);

        router.post(route('pengajar.materi.store'), formData, {
            forceFormData: true,
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Materi berhasil diupload',
                    timer: 1500,
                    showConfirmButton: false,
                });
                closeUploadModal();
            },
            onError: (errors) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: errors.file || 'Terjadi kesalahan saat upload',
                });
            },
            onFinish: () => {
                setUploading(false);
            }
        });
    };

    const handleDeleteMateri = (materiId, index) => {
        Swal.fire({
            title: 'Hapus Materi?',
            text: 'Materi yang dihapus tidak dapat dikembalikan',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('pengajar.materi.destroy', materiId), {
                    data: { index },
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Terhapus!',
                            text: 'Materi berhasil dihapus',
                            timer: 1500,
                            showConfirmButton: false,
                        });
                    }
                });
            }
        });
    };

    const totalSiswa = kelas.pendaftaran?.filter(p => p.status === 'aktif').length || 0;

    return (
        <PengajarLayout pengajar={pengajar}>
            <Head title={`Detail Kelas - ${kelas.nama_kelas}`} />

            <div className="space-y-6">
                {/* Back Button */}
                <Link
                    href={route("pengajar.kelas")}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                    <FaArrowLeft className="w-4 h-4" />
                    Kembali ke Daftar Kelas
                </Link>

                {/* Kelas Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="relative h-48 md:h-64">
                        <img
                            src={kelas.banner ? `/storage/${kelas.banner}` : '/Image/default-course.jpg'}
                            alt={kelas.nama_kelas}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <h1 className="text-2xl md:text-3xl font-bold mb-2">{kelas.nama_kelas}</h1>
                            <div className="flex flex-wrap gap-2">
                                {kelas.kategori ? (
                                    typeof kelas.kategori === 'string'
                                        ? kelas.kategori.split(',').map((cat, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/20 backdrop-blur text-white text-xs font-medium rounded-full"
                                            >
                                                <FaTag className="w-2.5 h-2.5" />
                                                {cat.trim()}
                                            </span>
                                        ))
                                        : kelas.kategori.map((cat, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/20 backdrop-blur text-white text-xs font-medium rounded-full"
                                            >
                                                <FaTag className="w-2.5 h-2.5" />
                                                {cat}
                                            </span>
                                        ))
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/20 backdrop-blur text-white text-xs rounded-full">
                                        <FaTag className="w-2.5 h-2.5" />
                                        Belum ada kategori
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <FaUsers className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-800">{totalSiswa}</p>
                                <p className="text-sm text-gray-500">Siswa Aktif</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <FaCalendarAlt className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-800">{kelas.jadwal?.length || 0}</p>
                                <p className="text-sm text-gray-500">Total Sesi</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <FaFileAlt className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-800">
                                    {kelas.jadwal?.reduce((acc, j) => acc + (j.materi?.materi?.length || 0), 0) || 0}
                                </p>
                                <p className="text-sm text-gray-500">Total Materi</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${kelas.level === 'pemula' ? 'bg-green-100 text-green-700' :
                                    kelas.level === 'menengah' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                    {kelas.level?.charAt(0).toUpperCase() + kelas.level?.slice(1)}
                                </span>
                                <p className="text-sm text-gray-500 mt-2">Level</p>
                            </div>
                        </div>

                        {kelas.link_zoom && (
                            <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
                                <FaLink className="w-5 h-5 text-blue-600" />
                                <span className="text-gray-700">Link Zoom:</span>
                                <a
                                    href={kelas.link_zoom}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline truncate"
                                >
                                    {kelas.link_zoom}
                                </a>
                            </div>
                        )}

                        <div className="mt-4">
                            <h3 className="font-semibold text-gray-800 mb-2">Deskripsi</h3>
                            <div
                                className="text-gray-600 prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: kelas.deskripsi }}
                            />
                        </div>
                    </div>
                </div>

                {/* Jadwal & Materi */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800">Jadwal & Materi</h2>
                        <p className="text-gray-500 text-sm mt-1">Upload materi PDF untuk setiap sesi</p>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {kelas.jadwal?.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                Belum ada jadwal untuk kelas ini
                            </div>
                        ) : (
                            kelas.jadwal?.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal)).map((jadwal, index) => (
                                <div key={jadwal.id} className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                                        {/* Jadwal Info */}
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="bg-indigo-100 rounded-lg p-3 text-center min-w-[70px]">
                                                <p className="text-xs text-indigo-600 font-medium">
                                                    Sesi {index + 1}
                                                </p>
                                                <p className="text-2xl font-bold text-indigo-700">
                                                    {new Date(jadwal.tanggal).getDate()}
                                                </p>
                                                <p className="text-xs text-indigo-600">
                                                    {new Date(jadwal.tanggal).toLocaleDateString("id-ID", { month: "short" })}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {formatDate(jadwal.tanggal)}
                                                </p>
                                                <p className="text-gray-500 text-sm">
                                                    Pukul {jadwal.waktu?.substring(0, 5)} WIB
                                                </p>
                                            </div>
                                        </div>

                                        {/* Upload Button */}
                                        <button
                                            onClick={() => openUploadModal(jadwal)}
                                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                        >
                                            <FaUpload className="w-4 h-4" />
                                            Upload Materi
                                        </button>
                                    </div>

                                    {/* Materi List */}
                                    {jadwal.materi?.materi?.length > 0 && (
                                        <div className="mt-4 ml-0 md:ml-[86px] space-y-2">
                                            {jadwal.materi.materi.map((item, mIndex) => (
                                                <div
                                                    key={mIndex}
                                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <FaFilePdf className="w-5 h-5 text-red-500" />
                                                        <div>
                                                            <p className="font-medium text-gray-800">{item.judul}</p>
                                                            <p className="text-xs text-gray-500">
                                                                Diupload: {new Date(item.uploaded_at).toLocaleDateString("id-ID")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <a
                                                            href={route('materi.download', [jadwal.materi.id, mIndex])}
                                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                            title="Download"
                                                        >
                                                            <FaDownload className="w-4 h-4" />
                                                        </a>
                                                        <button
                                                            onClick={() => handleDeleteMateri(jadwal.materi.id, mIndex)}
                                                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                            title="Hapus"
                                                        >
                                                            <FaTrash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Daftar Siswa */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800">Daftar Siswa</h2>
                        <p className="text-gray-500 text-sm mt-1">Siswa yang terdaftar di kelas ini</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {kelas.pendaftaran?.filter(p => p.status === 'aktif').length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                            Belum ada siswa terdaftar
                                        </td>
                                    </tr>
                                ) : (
                                    kelas.pendaftaran?.filter(p => p.status === 'aktif').map((pendaftaran, idx) => (
                                        <tr key={pendaftaran.id_pendaftaran}>
                                            <td className="px-6 py-4 text-sm text-gray-500">{idx + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={pendaftaran.peserta?.foto ? `/storage/${pendaftaran.peserta.foto}` : '/Image/default-avatar.png'}
                                                        alt={pendaftaran.peserta?.name}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                    <span className="font-medium text-gray-800">
                                                        {pendaftaran.peserta?.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {pendaftaran.peserta?.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                                    Aktif
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800">Upload Materi</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Sesi: {formatDate(selectedJadwal?.tanggal)}
                            </p>
                        </div>

                        <form onSubmit={handleUpload}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Judul Materi
                                    </label>
                                    <input
                                        type="text"
                                        value={data.judul}
                                        onChange={(e) => setData('judul', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Masukkan judul materi"
                                        required
                                    />
                                    {errors.judul && (
                                        <p className="text-red-500 text-sm mt-1">{errors.judul}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        File PDF
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => setData('file', e.target.files[0])}
                                            className="hidden"
                                            id="file-upload"
                                            required
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            <FaUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-600">
                                                {data.file ? data.file.name : 'Klik untuk memilih file PDF'}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">Maksimal 10MB</p>
                                        </label>
                                    </div>
                                    {errors.file && (
                                        <p className="text-red-500 text-sm mt-1">{errors.file}</p>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={closeUploadModal}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading || processing}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                >
                                    {uploading ? 'Mengupload...' : 'Upload'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PengajarLayout>
    );
}
