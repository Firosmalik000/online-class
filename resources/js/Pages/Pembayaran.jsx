import React, { useState, useMemo } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    FaEye,
    FaSearch,
    FaCheck,
    FaTimes,
    FaClock,
    FaDownload,
    FaMoneyBillWave,
    FaCreditCard,
    FaMoneyBillAlt, // Mengganti FaMoneyBillWave dengan FaMoneyBillAlt (opsional, tergantung preferensi icon)
    FaWallet, // Untuk E-Wallet
    FaBarcode, // Untuk QRIS
} from "react-icons/fa";
import Swal from "sweetalert2";

import DashboardLayout from "@/Layouts/DashboardLayout";
import { SheetDetail } from "@/Components/SheetDetail"; // Asumsi komponen ini ada

// --- Komponen Pembantu ---

// Komponen Badge Status Pembayaran
const PaymentStatusBadge = ({ status }) => {
    const normalizedStatus = (status || "").toString().trim().toLowerCase();

    const statusConfig = {
        belum: {
            bg: "bg-blue-100",
            text: "text-blue-800",
            label: "Belum Bayar",
            icon: FaClock,
        },
        pending: {
            bg: "bg-yellow-100",
            text: "text-yellow-800",
            label: "Menunggu",
            icon: FaClock,
        },
        lunas: {
            bg: "bg-green-100",
            text: "text-green-800",
            label: "Lunas",
            icon: FaCheck,
        },
        gagal: {
            bg: "bg-red-100",
            text: "text-red-800",
            label: "Gagal",
            icon: FaTimes,
        },
        expired: {
            bg: "bg-gray-100",
            text: "text-gray-800",
            label: "Kadaluarsa",
            icon: FaTimes,
        },
        refunded: {
            bg: "bg-purple-100",
            text: "text-purple-800",
            label: "Dikembalikan",
            icon: FaMoneyBillWave,
        },
    };

    const config = statusConfig[normalizedStatus] || {
        bg: "bg-gray-100",
        text: "text-gray-800",
        label: normalizedStatus || "Tidak Diketahui",
        icon: FaClock,
    };

    const IconComponent = config.icon;

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
        >
            <IconComponent className="mr-1.5 h-3 w-3" />
            {config.label}
        </span>
    );
};

// Komponen Badge Metode Pembayaran
const PaymentMethodBadge = ({ method }) => {
    const normalizedMethod = (method || "").toString().trim().toLowerCase();

    const methodConfig = {
        qris: {
            bg: "bg-emerald-100",
            text: "text-emerald-800",
            label: "QRIS",
            icon: FaBarcode,
        },
        bank_transfer: {
            bg: "bg-blue-100",
            text: "text-blue-800",
            label: "Transfer Bank",
            icon: FaMoneyBillAlt,
        },
        ewallet: {
            bg: "bg-indigo-100",
            text: "text-indigo-800",
            label: "E-Wallet",
            icon: FaWallet,
        },
        credit_card: {
            bg: "bg-rose-100",
            text: "text-rose-800",
            label: "Kartu Kredit",
            icon: FaCreditCard,
        },
        cstore: {
            bg: "bg-green-100",
            text: "text-green-800",
            label: "Tunai (CS Store)",
            icon: FaMoneyBillWave,
        },
    };

    const config = methodConfig[normalizedMethod] || {
        bg: "bg-gray-100",
        text: "text-gray-800",
        label: normalizedMethod || "Tidak Diketahui",
        icon: FaMoneyBillWave,
    };

    const IconComponent = config.icon;

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
        >
            <IconComponent className="mr-1.5 h-3 w-3" />
            {config.label}
        </span>
    );
};

// Fungsi Format Tanggal
const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};

// Fungsi Format Mata Uang
const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(amount || 0);
};

// --- Komponen Utama Pembayaran ---

const Pembayaran = ({ pembayaran, event }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [methodFilter, setMethodFilter] = useState("all");

    const { put, processing } = useForm();

    const filteredData = useMemo(() => {
        return pembayaran.filter((item) => {
            const matchesSearch =
                item?.pendaftaran?.peserta?.nama
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                item?.pendaftaran?.peserta?.email
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                item?.pendaftaran?.kelas?.nama_kelas
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                item?.pendaftaran?.nomor_transaksi
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                item?.id?.toString().includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "all" ||
                (item?.status || "").toString().trim().toLowerCase() ===
                    statusFilter;
            const matchesMethod =
                methodFilter === "all" ||
                (item?.metode || "").toString().trim().toLowerCase() ===
                    methodFilter;

            return matchesSearch && matchesStatus && matchesMethod;
        });
    }, [pembayaran, searchTerm, statusFilter, methodFilter]);

    const handleUpdateStatus = (id, newStatus) => {
        Swal.fire({
            title: "Konfirmasi",
            text: `Apakah Anda yakin ingin mengubah status pembayaran menjadi ${newStatus}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, Ubah!",
            cancelButtonText: "Batal",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                put(
                    route("payment.update-status", id),
                    {
                        status: newStatus,
                    },
                    {
                        onSuccess: () => {
                            Swal.fire(
                                "Berhasil!",
                                "Status pembayaran berhasil diubah.",
                                "success"
                            );
                        },
                        onError: (errors) => {
                            let errorMessage =
                                "Terjadi kesalahan saat mengubah status.";
                            if (errors && Object.keys(errors).length > 0) {
                                errorMessage = Object.values(errors).join("\n");
                            }
                            Swal.fire("Error!", errorMessage, "error");
                        },
                    }
                );
            }
        });
    };

    const totalPending = useMemo(
        () =>
            pembayaran.filter((item) =>
                ["pending", "belum"].includes((item.status || "").toLowerCase())
            ).length,
        [pembayaran]
    );
    const totalLunas = useMemo(
        () =>
            pembayaran.filter(
                (item) => (item.status || "").toLowerCase() === "lunas"
            ).length,
        [pembayaran]
    );
    const totalGagal = useMemo(
        () =>
            pembayaran.filter((item) =>
                ["gagal", "expired"].includes((item.status || "").toLowerCase())
            ).length,
        [pembayaran]
    );

    return (
        <DashboardLayout>
            <Head title="Data Pembayaran" />

            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                            Manajemen Pembayaran
                        </h1>
                        <p className="mt-2 text-lg text-gray-600">
                            Kelola dan pantau semua transaksi pembayaran untuk
                            kelas Anda dengan mudah.
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <StatCard
                            title="Menunggu Pembayaran"
                            count={totalPending}
                            icon={
                                <FaClock className="w-8 h-8 text-yellow-500" />
                            }
                        />
                        <StatCard
                            title="Pembayaran Lunas"
                            count={totalLunas}
                            icon={
                                <FaCheck className="w-8 h-8 text-green-500" />
                            }
                        />
                        <StatCard
                            title="Pembayaran Gagal/Kadaluarsa"
                            count={totalGagal}
                            icon={<FaTimes className="w-8 h-8 text-red-500" />}
                        />
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
                        <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                            {/* Search Input */}
                            <div className="flex-1">
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari transaksi (nama, email, kelas, ID)..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div className="w-full lg:w-48">
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                                >
                                    <option value="all">Semua Status</option>
                                    <option value="belum">Belum Bayar</option>
                                    <option value="pending">Menunggu</option>
                                    <option value="lunas">Lunas</option>
                                    <option value="gagal">Gagal</option>
                                    <option value="expired">Kadaluarsa</option>
                                    <option value="refunded">
                                        Dikembalikan
                                    </option>
                                </select>
                            </div>

                            {/* Method Filter */}
                            <div className="w-full lg:w-48">
                                <select
                                    value={methodFilter}
                                    onChange={(e) =>
                                        setMethodFilter(e.target.value)
                                    }
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                                >
                                    <option value="all">Semua Metode</option>
                                    <option value="qris">QRIS</option>
                                    <option value="transfer">
                                        Transfer Bank
                                    </option>
                                    <option value="ewallet">E-Wallet</option>
                                    <option value="credit_card">
                                        Kartu Kredit
                                    </option>
                                    <option value="cash">Tunai</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Table */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <TableHeader>Transaksi</TableHeader>
                                        <TableHeader>Kelas</TableHeader>
                                        <TableHeader>Jumlah</TableHeader>
                                        <TableHeader>Metode</TableHeader>
                                        <TableHeader>Status</TableHeader>
                                        <TableHeader>Tanggal</TableHeader>
                                        <TableHeader>Aksi</TableHeader>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredData.length > 0 ? (
                                        filteredData.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-gray-50 transition-colors duration-150"
                                            >
                                                <TableCell>
                                                    <div className="font-semibold text-gray-900 text-sm">
                                                        #
                                                        {item.nomor_transaksi ||
                                                            item.id}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        ID: {item.id}
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {item.kelas
                                                            ?.nama_kelas ||
                                                            item.pendaftaran
                                                                ?.kelas
                                                                ?.nama_kelas ||
                                                            "N/A"}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {item.kelas?.kategori ||
                                                            item.pendaftaran
                                                                ?.kelas
                                                                ?.kategori ||
                                                            "N/A"}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-bold text-gray-900">
                                                    {formatCurrency(
                                                        item.jumlah_bayar ||
                                                            item.total_harga ||
                                                            0
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <PaymentMethodBadge
                                                        method={
                                                            item.metode ||
                                                            "transfer"
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <PaymentStatusBadge
                                                        status={
                                                            item.status ||
                                                            "pending"
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-500">
                                                    {formatDate(
                                                        item.created_at
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <SheetDetail
                                                            title="Detail Order"
                                                            item={item}
                                                            trigger={
                                                                <button
                                                                    type="button"
                                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                                                    title="Lihat Detail"
                                                                >
                                                                    <FaEye className="mr-1.5 h-3 w-3" />
                                                                    Detail
                                                                </button>
                                                            }
                                                        />

                                                        {/* Aksi untuk update status (misal: set lunas) */}
                                                        {(item.status ===
                                                            "pending" ||
                                                            item.status ===
                                                                "belum") && (
                                                            <>
                                                                <Link
                                                                    href={route(
                                                                        "order.detail",
                                                                        item.id
                                                                    )}
                                                                    className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                                                >
                                                                    <FaEye
                                                                        className="mr-1"
                                                                        size={
                                                                            10
                                                                        }
                                                                    />
                                                                    BAYAR
                                                                </Link>
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="8"
                                                className="px-6 py-12 text-center"
                                            >
                                                <EmptyState
                                                    searchTerm={searchTerm}
                                                    statusFilter={statusFilter}
                                                    methodFilter={methodFilter}
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Info & Total Summary */}
                        {filteredData.length > 0 && (
                            <div className="bg-white px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between">
                                <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                                    Menampilkan{" "}
                                    <span className="font-semibold">
                                        {filteredData.length}
                                    </span>{" "}
                                    dari{" "}
                                    <span className="font-semibold">
                                        {pembayaran.length}
                                    </span>{" "}
                                    transaksi
                                </div>
                                <div className="text-sm text-gray-800 font-semibold">
                                    Total Pendapatan (Filter):{" "}
                                    {formatCurrency(
                                        filteredData.reduce(
                                            (total, item) =>
                                                total + (item.total_harga || 0),
                                            0
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Pembayaran;

// --- Komponen Pembantu Lainnya ---

// Komponen Card Statistik
const StatCard = ({ title, count, icon }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-gray-100 rounded-full">
                {icon}
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{count}</p>
            </div>
        </div>
    </div>
);

// Komponen Header Tabel
const TableHeader = ({ children }) => (
    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
        {children}
    </th>
);

// Komponen Sel Tabel
const TableCell = ({ children, className = "" }) => (
    <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>
);

// Komponen Empty State untuk Tabel
const EmptyState = ({ searchTerm, statusFilter, methodFilter }) => (
    <div className="flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <FaCreditCard className="text-gray-400 text-3xl" />
        </div>
        <p className="text-gray-600 text-xl font-semibold mb-2">
            Tidak ada data pembayaran ditemukan.
        </p>
        <p className="text-gray-400 text-sm max-w-sm">
            {searchTerm || statusFilter !== "all" || methodFilter !== "all"
                ? "Coba sesuaikan filter pencarian Anda atau reset filter untuk melihat semua data."
                : "Belum ada transaksi pembayaran yang tercatat. Mulai buat transaksi baru untuk melihat datanya di sini."}
        </p>
        {(searchTerm || statusFilter !== "all" || methodFilter !== "all") && (
            <button
                onClick={() => {
                    window.location.reload(); // Cara sederhana untuk mereset semua filter (bisa disempurnakan dengan fungsi resetState)
                }}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium shadow-sm"
            >
                Reset Filter
            </button>
        )}
    </div>
);
