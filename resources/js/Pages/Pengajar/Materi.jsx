import PengajarLayout from "@/Layouts/PengajarLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import { 
    FaUpload, 
    FaTrash, 
    FaDownload, 
    FaFilePdf, 
    FaBook,
    FaCalendarAlt,
    FaSearch,
    FaEye
} from "react-icons/fa";
import Swal from "sweetalert2";

export default function Materi({ pengajar, kelasList }) {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedJadwal, setSelectedJadwal] = useState(null);
    const [selectedKelas, setSelectedKelas] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterKelas, setFilterKelas] = useState('all');

    const { data, setData, reset } = useForm({
        id_jadwal: '',
        judul: '',
        file: null,
    });

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // Flatten all materi from all kelas - updated for new structure
    const getAllMateri = () => {
        const allMateri = [];
        kelasList.forEach(kelas => {
            kelas.jadwal?.forEach(jadwal => {
                // Now materi is an array of individual records
                jadwal.materis?.forEach((materi) => {
                    allMateri.push({
                        ...materi,
                        jadwal: jadwal,
                        kelas: kelas,
                    });
                });
            });
        });
        return allMateri;
    };

    const allMateri = getAllMateri();

    // Filter materi
    const filteredMateri = allMateri.filter(m => {
        const matchSearch = m.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.kelas.nama_kelas.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.filename.toLowerCase().includes(searchQuery.toLowerCase());
        const matchKelas = filterKelas === 'all' || m.kelas.id_kelas === parseInt(filterKelas);
        return matchSearch && matchKelas;
    });

    const openUploadModal = (kelas = null, jadwal = null) => {
        setSelectedKelas(kelas);
        setSelectedJadwal(jadwal);
        if (jadwal) {
            setData('id_jadwal', jadwal.id);
        }
        setShowUploadModal(true);
    };

    const closeUploadModal = () => {
        setShowUploadModal(false);
        setSelectedKelas(null);
        setSelectedJadwal(null);
        reset();
    };

    const handleUpload = (e) => {
        e.preventDefault();
        
        if (!data.id_jadwal || !data.judul || !data.file) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal!',
                text: 'Semua field harus diisi',
            });
            return;
        }

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
                    text: errors.file || errors.judul || 'Terjadi kesalahan saat upload',
                });
            },
            onFinish: () => {
                setUploading(false);
            }
        });
    };

    const handleDeleteMateri = (materiId) => {
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

    const handleViewMateri = (materiId) => {
        window.open(route('pengajar.materi.view', materiId), '_blank');
    };

    return (
        <PengajarLayout pengajar={pengajar}>
            <Head title="Kelola Materi" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Kelola Materi</h1>
                        <p className="text-gray-500 mt-1">Upload dan kelola materi pembelajaran</p>
                    </div>

                    <button
                        onClick={() => openUploadModal()}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <FaUpload className="w-4 h-4" />
                        Upload Materi Baru
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Cari materi..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <select
                            value={filterKelas}
                            onChange={(e) => setFilterKelas(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="all">Semua Kelas</option>
                            {kelasList.map(kelas => (
                                <option key={kelas.id_kelas} value={kelas.id_kelas}>
                                    {kelas.nama_kelas}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-100 p-3 rounded-lg">
                                <FaFilePdf className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{allMateri.length}</p>
                                <p className="text-sm text-gray-500">Total Materi</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-3 rounded-lg">
                                <FaBook className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{kelasList.length}</p>
                                <p className="text-sm text-gray-500">Kelas Aktif</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <FaCalendarAlt className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">
                                    {kelasList.reduce((acc, k) => acc + (k.jadwal?.length || 0), 0)}
                                </p>
                                <p className="text-sm text-gray-500">Total Sesi</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Materi List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800">Daftar Materi</h2>
                    </div>

                    {filteredMateri.length === 0 ? (
                        <div className="p-12 text-center">
                            <FaFilePdf className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">
                                {allMateri.length === 0 
                                    ? 'Belum ada materi yang diupload' 
                                    : 'Tidak ada materi yang cocok dengan filter'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama File</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sesi</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Upload</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredMateri.map((materi, idx) => (
                                        <tr key={materi.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <FaFilePdf className="w-8 h-8 text-red-500" />
                                                    <span className="font-medium text-gray-800">{materi.judul}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {materi.filename}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {materi.kelas.nama_kelas}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {formatDate(materi.jadwal.tanggal)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {materi.created_at ? new Date(materi.created_at).toLocaleDateString("id-ID") : '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleViewMateri(materi.id)}
                                                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                                        title="Lihat"
                                                    >
                                                        <FaEye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteMateri(materi.id)}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <FaTrash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800">Upload Materi Baru</h3>
                        </div>

                        <form onSubmit={handleUpload}>
                            <div className="p-6 space-y-4">
                                {/* Select Kelas */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Pilih Kelas
                                    </label>
                                    <select
                                        value={selectedKelas?.id_kelas || ''}
                                        onChange={(e) => {
                                            const kelas = kelasList.find(k => k.id_kelas === parseInt(e.target.value));
                                            setSelectedKelas(kelas);
                                            setSelectedJadwal(null);
                                            setData('id_jadwal', '');
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    >
                                        <option value="">-- Pilih Kelas --</option>
                                        {kelasList.map(kelas => (
                                            <option key={kelas.id_kelas} value={kelas.id_kelas}>
                                                {kelas.nama_kelas}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Select Jadwal */}
                                {selectedKelas && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Pilih Sesi/Jadwal
                                        </label>
                                        <select
                                            value={data.id_jadwal}
                                            onChange={(e) => {
                                                setData('id_jadwal', e.target.value);
                                                const jadwal = selectedKelas.jadwal?.find(j => j.id === parseInt(e.target.value));
                                                setSelectedJadwal(jadwal);
                                            }}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        >
                                            <option value="">-- Pilih Jadwal --</option>
                                            {selectedKelas.jadwal?.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal)).map((jadwal, idx) => (
                                                <option key={jadwal.id} value={jadwal.id}>
                                                    Sesi {idx + 1} - {formatDate(jadwal.tanggal)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Judul Materi */}
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
                                </div>

                                {/* File Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        File PDF
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => setData('file', e.target.files[0])}
                                            className="hidden"
                                            id="file-upload-modal"
                                            required
                                        />
                                        <label htmlFor="file-upload-modal" className="cursor-pointer">
                                            <FaUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-600">
                                                {data.file ? (
                                                    <span className="text-indigo-600 font-medium">{data.file.name}</span>
                                                ) : (
                                                    'Klik untuk memilih file PDF'
                                                )}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">Maksimal 10MB</p>
                                        </label>
                                    </div>
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
                                    disabled={uploading}
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
