import React, { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import WelcomeLayout from "@/Layouts/WelcomeLayout";

const DetailPembayaran = ({ pembayaran }) => {
    const { env } = usePage().props;
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState("");

    const { data, processing, post } = useForm({
        id: pembayaran.id,
        status: pembayaran.status,
        metode: pembayaran.metode,
        error: null,
    });

    // Inisialisasi Snap hanya sekali
    const initializeSnap = () => {
        return new Promise((resolve, reject) => {
            if (window.snap) {
                resolve(window.snap);
                return;
            }

            const script = document.createElement("script");
            script.src = env.midtrans_is_production
                ? "https://app.midtrans.com/snap/snap.js"
                : "https://app.sandbox.midtrans.com/snap/snap.js";
            script.setAttribute("data-client-key", env.midtrans_client_key);

            script.onload = () => {
                resolve(window.snap);
            };

            script.onerror = () => {
                reject(new Error("Failed to load Midtrans script"));
            };

            document.head.appendChild(script);
        });
    };

    const checkout = async () => {
        if (!pembayaran.snap_token) {
            alert("Snap token tidak tersedia. Silakan refresh halaman.");
            return;
        }

        setIsProcessing(true);
        setPaymentStatus("Memuat pembayaran...");

        try {
            const snap = await initializeSnap();

            snap.pay(pembayaran.snap_token, {
                onSuccess: function (result) {
                    setPaymentStatus("✅ Pembayaran berhasil!");
                    setIsProcessing(false);

                    data.status = "lunas";
                    data.metode = result.payment_type; // Simpan metode pembayaran
                    // post(route("pendaftaran.update"), data);
                    post(route("pendaftaran.update"), data, {
                        onSuccess: () => {
                            Inertia.visit(route("order.index"));
                        },
                    });
                },
                onPending: function (result) {
                    setPaymentStatus("⏳ Pembayaran sedang diproses...");
                    setIsProcessing(false);

                    // Update status pembayaran ke server
                    data.status = "gagal";
                    post(route("pendaftaran.update"), data);
                },

                onError: function (result) {
                    setPaymentStatus("❌ Pembayaran gagal. Silakan coba lagi.");
                    setIsProcessing(false);

                    // Log error ke server (optional)
                    data.status = "gagal";
                    data.error = result.status_message || "Pembayaran gagal";
                    post(route("pendaftaran.update"), data);
                },

                onClose: function () {
                    if (isProcessing) {
                        setPaymentStatus("⚠️ Pembayaran dibatalkan");
                        setIsProcessing(false);
                    }
                },
            });
        } catch (error) {
            console.error("Error initializing payment:", error);
            setPaymentStatus("❌ Gagal memuat sistem pembayaran");
            setIsProcessing(false);
        }
    };

    // Format currency to IDR
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(amount);
    };

    return (
        <WelcomeLayout>
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                    <h2 className="text-xl font-bold text-white text-center">
                        Detail Pembayaran
                    </h2>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Class Info Card */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-600 block mb-1">
                                    Nama Kelas
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {pembayaran.pendaftaran.kelas.nama_kelas}
                                </p>
                            </div>

                            <div className="border-t pt-3">
                                <label className="text-sm font-medium text-gray-600 block mb-1">
                                    Harga
                                </label>
                                <p className="text-2xl font-bold text-green-600">
                                    {formatCurrency(
                                        pembayaran.pendaftaran.kelas.harga
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h3 className="font-semibold text-blue-900 mb-2">
                            Ringkasan Pembayaran
                        </h3>
                        <div className="flex justify-between items-center">
                            <span className="text-blue-700">
                                Total yang harus dibayar:
                            </span>
                            <span className="text-xl font-bold text-blue-900">
                                {formatCurrency(
                                    pembayaran.pendaftaran.kelas.harga
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Payment Status */}
                    {paymentStatus && (
                        <div
                            className={`rounded-lg p-4 border ${
                                paymentStatus.includes("✅")
                                    ? "bg-green-50 border-green-200 text-green-800"
                                    : paymentStatus.includes("⏳")
                                    ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                                    : paymentStatus.includes("❌")
                                    ? "bg-red-50 border-red-200 text-red-800"
                                    : "bg-blue-50 border-blue-200 text-blue-800"
                            }`}
                        >
                            <p className="text-center font-medium">
                                {paymentStatus}
                            </p>
                        </div>
                    )}

                    {/* Snap Token Info (for debugging) */}
                    {env.app_debug && (
                        <div className="bg-gray-100 rounded-lg p-3 text-xs">
                            <strong>Debug Info:</strong>
                            <div>
                                Snap Token:{" "}
                                {pembayaran.snap_token
                                    ? "✓ Available"
                                    : "✗ Not Available"}
                            </div>
                            <div>
                                Environment:{" "}
                                {env.midtrans_is_production
                                    ? "Production"
                                    : "Sandbox"}
                            </div>
                        </div>
                    )}

                    {/* Payment Button */}
                    <button
                        onClick={checkout}
                        disabled={isProcessing || !pembayaran.snap_token}
                        className={`w-full font-bold py-4 px-6 rounded-lg transition-all duration-200 transform focus:outline-none focus:ring-4 ${
                            isProcessing || !pembayaran.snap_token
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:scale-105 hover:shadow-lg focus:ring-green-300 active:scale-95"
                        } text-white`}
                    >
                        <div className="flex items-center justify-center space-x-2">
                            {isProcessing ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                    />
                                </svg>
                            )}
                            <span>
                                {!pembayaran.snap_token
                                    ? "Token Tidak Tersedia"
                                    : isProcessing
                                    ? "Memproses..."
                                    : "Bayar Sekarang"}
                            </span>
                        </div>
                    </button>

                    {/* Security Info */}
                    <div className="text-center text-sm text-gray-500">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                            <span>Pembayaran Aman</span>
                        </div>
                        <p>
                            Didukung oleh Midtrans - Platform pembayaran
                            terpercaya
                        </p>
                    </div>
                </div>
            </div>
        </WelcomeLayout>
    );
};

export default DetailPembayaran;
