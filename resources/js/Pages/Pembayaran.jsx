import React, { useState } from "react";
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
} from "react-icons/fa";
import Swal from "sweetalert2";

import DashboardLayout from "@/Layouts/DashboardLayout";

const Pembayaran = ({ pembayaran, event }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [methodFilter, setMethodFilter] = useState("all");

    const { put, processing } = useForm();

    // Filter data berdasarkan pencarian, status, dan metode
    const filteredData = pembayaran.filter((item) => {
        const matchesSearch =
            item?.pendaftaran?.peserta?.nama
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            item?.pendaftaran?.peserta?.email
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            item?.pendaftaran.kelas?.nama_kelas
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            item?.pendaftaran.nomor_transaksi
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || item?.status === statusFilter;
        const matchesMethod =
            methodFilter === "all" ||
            item?.pendaftaran.metode_pembayaran === methodFilter;

        // return item;
        return matchesSearch && matchesStatus && matchesMethod;
    });

    const getPaymentStatusBadge = (status) => {
        const normalizedStatus = (status || "").toString().trim().toLowerCase();

        const statusConfig = {
            belum: {
                bg: "bg-blue-500",
                text: "text-white",
                label: "Belum",
                icon: FaClock,
            },
            pending: {
                bg: "bg-yellow-100",
                text: "text-yellow-800",
                label: "Menunggu",
                icon: FaClock,
            },
            paid: {
                bg: "bg-green-100",
                text: "text-green-800",
                label: "Lunas",
                icon: FaCheck,
            },
            failed: {
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

        const config = statusConfig[status] || {
            bg: "bg-gray-100",
            text: "text-gray-800",
            label: status || "Unknown",
            icon: FaClock,
        };

        const IconComponent = config.icon;

        return (
            <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
            >
                <IconComponent className="mr-1" size={10} />
                {config.label}
            </span>
        );
    };

    // Fungsi untuk mendapatkan badge metode pembayaran
    const getPaymentMethodBadge = (method) => {
        const methodConfig = {
            transfer: {
                bg: "bg-blue-100",
                text: "text-blue-800",
                label: "Transfer Bank",
            },
            ewallet: {
                bg: "bg-purple-100",
                text: "text-purple-800",
                label: "E-Wallet",
            },
            credit_card: {
                bg: "bg-indigo-100",
                text: "text-indigo-800",
                label: "Kartu Kredit",
            },
            cash: {
                bg: "bg-green-100",
                text: "text-green-800",
                label: "Tunai",
            },
        };

        const config = methodConfig[method] || {
            bg: "bg-gray-100",
            text: "text-gray-800",
            label: method,
        };

        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
            >
                {config.label}
            </span>
        );
    };

    // Format tanggal
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Format mata uang
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Handle update status pembayaran
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
                        onError: () => {
                            Swal.fire(
                                "Error!",
                                "Terjadi kesalahan saat mengubah status.",
                                "error"
                            );
                        },
                    }
                );
            }
        });
    };

    // Hitung total pembayaran berdasarkan status
    const getTotalByStatus = (status) => {
        return pembayaran
            .filter((item) => item.status === status)
            .reduce((total, item) => total + (item.jumlah_bayar || 0), 0);
    };

    return (
        <DashboardLayout>
            <Head title="Data Pembayaran" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Data Pembayaran
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Kelola semua transaksi pembayaran kelas
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <FaMoneyBillWave className="w-8 h-8 text-green-500" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">
                                        Total Pendapatan
                                    </p>
                                    <p className="text-xl font-bold text-gray-900">
                                        {formatCurrency(
                                            getTotalByStatus("lunas")
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <FaClock className="w-8 h-8 text-yellow-500" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">
                                        Menunggu Pembayaran
                                    </p>
                                    <p className="text-xl font-bold text-gray-900">
                                        {
                                            pembayaran.filter(
                                                (item) =>
                                                    item.status === "pending" ||
                                                    item.status === "belum"
                                            ).length
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <FaCheck className="w-8 h-8 text-green-500" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">
                                        Pembayaran Lunas
                                    </p>
                                    <p className="text-xl font-bold text-gray-900">
                                        {
                                            pembayaran.filter(
                                                (item) => item.status === "lunas"
                                            ).length
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <FaTimes className="w-8 h-8 text-red-500" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">
                                        Pembayaran Gagal
                                    </p>
                                    <p className="text-xl font-bold text-gray-900">
                                        {
                                            pembayaran.filter((item) =>
                                                ["belum"].includes(
                                                    item.status
                                                )
                                            ).length
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow mb-6">
                        <div className="p-6">
                            <div className="flex flex-col lg:flex-row gap-4">
                                {/* Search */}
                                <div className="flex-1">
                                    <div className="relative">
                                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Cari berdasarkan nama, email, kelas, atau nomor transaksi..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Status Filter */}
                                <div className="sm:w-48">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) =>
                                            setStatusFilter(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="all">
                                            Semua Status
                                        </option>
                                        <option value="belum">Belum</option>
                                        <option value="pending">
                                            Menunggu
                                        </option>
                                        <option value="lunas">Lunas</option>
                                        <option value="failed">Gagal</option>
                                        <option value="expired">
                                            Kadaluarsa
                                        </option>
                                        <option value="refunded">
                                            Dikembalikan
                                        </option>
                                    </select>
                                </div>

                                {/* Method Filter */}
                                <div className="sm:w-48">
                                    <select
                                        value={methodFilter}
                                        onChange={(e) =>
                                            setMethodFilter(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="all">
                                            Semua Metode
                                        </option>
                                        <option value="transfer">
                                            Transfer Bank
                                        </option>
                                        <option value="ewallet">
                                            E-Wallet
                                        </option>
                                        <option value="credit_card">
                                            Kartu Kredit
                                        </option>
                                        <option value="cash">Tunai</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Transaksi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Peserta
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Kelas
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Jumlah
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Metode
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredData.length > 0 ? (
                                        filteredData.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            #
                                                            {item.nomor_transaksi ||
                                                                item.id}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            ID: {item.id}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {item.pendaftaran
                                                                .peserta
                                                                ?.name ||
                                                                item.user
                                                                    ?.name ||
                                                                item
                                                                    ?.pendaftaran
                                                                    ?.peserta
                                                                    ?.nama ||
                                                                "N/A"}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {item.pendaftaran
                                                                .peserta
                                                                ?.email ||
                                                                item.user
                                                                    ?.email ||
                                                                item.pendaftaran
                                                                    ?.email ||
                                                                "N/A"}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {item.kelas
                                                                ?.nama_kelas ||
                                                                item.pendaftaran
                                                                    ?.kelas
                                                                    ?.nama_kelas ||
                                                                "N/A"}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {item.kelas
                                                                ?.kategori ||
                                                                item.pendaftaran
                                                                    ?.kelas
                                                                    ?.kategori ||
                                                                "N/A"}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                    {formatCurrency(
                                                        item.jumlah_bayar ||
                                                        item.total_harga ||
                                                        0
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getPaymentMethodBadge(
                                                        item.metode_pembayaran ||
                                                        "transfer"
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getPaymentStatusBadge(
                                                        item.status || "pending"
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.created_at
                                                        ? formatDate(
                                                            item.created_at
                                                        )
                                                        : "N/A"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        {/* <SheetDetail
                                                            title="Detail Pembayaran"
                                                            item={item}
                                                            trigger={
                                                                <div className="inline-flex items-center px-2 py-1 border cursor-pointer border-transparent text-xs leading-4 font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                                                                    <FaEye
                                                                        className="mr-1"
                                                                        size={
                                                                            10
                                                                        }
                                                                    />
                                                                    Detail
                                                                </div>
                                                            }
                                                        /> */}
                                                        <Link
                                                            href={route(
                                                                "order.detail",
                                                                item.id
                                                            )}
                                                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                                        >
                                                            <FaEye
                                                                className="mr-1"
                                                                size={10}
                                                            />
                                                            Detail
                                                        </Link>
                                                        {item.status ===
                                                            "pending" && (
                                                                <>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleUpdateStatus(
                                                                                item.id,
                                                                                "paid"
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            processing
                                                                        }
                                                                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                                                                    >
                                                                        <FaCheck
                                                                            className="mr-1"
                                                                            size={
                                                                                10
                                                                            }
                                                                        />
                                                                        Konfirmasi
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleUpdateStatus(
                                                                                item.id,
                                                                                "failed"
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            processing
                                                                        }
                                                                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                                                                    >
                                                                        <FaTimes
                                                                            className="mr-1"
                                                                            size={
                                                                                10
                                                                            }
                                                                        />
                                                                        Tolak
                                                                    </button>
                                                                </>
                                                            )}

                                                        {item.bukti_pembayaran && (
                                                            <a
                                                                href={`/storage/${item.bukti_pembayaran}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                                                            >
                                                                <FaDownload
                                                                    className="mr-1"
                                                                    size={10}
                                                                />
                                                                Bukti
                                                            </a>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="8"
                                                className="px-6 py-12 text-center"
                                            >
                                                <div className="flex flex-col items-center">
                                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                        <FaCreditCard className="text-gray-400" />
                                                    </div>
                                                    <p className="text-gray-500 text-lg font-medium">
                                                        Tidak ada data
                                                        pembayaran
                                                    </p>
                                                    <p className="text-gray-400 text-sm mt-1">
                                                        {searchTerm ||
                                                            statusFilter !==
                                                            "all" ||
                                                            methodFilter !== "all"
                                                            ? "Coba ubah filter pencarian Anda"
                                                            : "Belum ada transaksi pembayaran yang masuk"}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Info */}
                        {filteredData.length > 0 && (
                            <div className="bg-white px-6 py-3 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Menampilkan{" "}
                                        <span className="font-medium">
                                            {filteredData.length}
                                        </span>{" "}
                                        dari{" "}
                                        <span className="font-medium">
                                            {pembayaran.length}
                                        </span>{" "}
                                        transaksi
                                    </div>
                                    <div className="text-sm text-gray-700 font-medium">
                                        Total:{" "}
                                        {formatCurrency(
                                            filteredData.reduce(
                                                (total, item) =>
                                                    total +
                                                    (item.jumlah_bayar || 0),
                                                0
                                            )
                                        )}
                                    </div>
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
