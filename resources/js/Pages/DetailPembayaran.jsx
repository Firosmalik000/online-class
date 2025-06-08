import React, { useState } from "react";
import { initSnap, isCancel, useSnap } from "midtrans-snap";
import { useForm, usePage, router } from "@inertiajs/react";
import WelcomeLayout from "@/Layouts/WelcomeLayout";

const DetailPembayaran = ({ pembayaran }) => {
    console.log({ pembayaran });
    const { env } = usePage().props;
    const [paymentStatus, setPaymentStatus] = useState(pembayaran.status);
    const [isProcessing, setIsProcessing] = useState(false);

    const { data, setData, post, processing } = useForm({
        id: pembayaran.id,
        status: pembayaran.status,
    });
    console.log({ env });

    initSnap(env.midtrans_client_key, "sandbox" /* or 'production' */);

    const checkout = async () => {
        const snap = useSnap();
        setIsProcessing(true);
        try {
            const result = await snap.pay(pembayaran.snap_token);
            if (result.transaction_status !== "pending") {
                console.log("payment success");
            }
        } catch (error) {
            if (isCancel(error)) {
                console.log("payment canceled");
            } else {
                console.error(error);
            }
        }

        //    await snap.pay(pembayaran.snap_token, {
        //         onSuccess: function (result) {
        //             console.log("Pembayaran sukses:", result);

        //             // Update status dan kirim ke backend
        //             setPaymentStatus("lunas");

        //             post(
        //                 route("pembayaran.update", pembayaran.id),
        //                 {
        //                     status: "lunas",
        //                     transaction_id: result.transaction_id,
        //                     payment_type: result.payment_type,
        //                     order_id: result.order_id,
        //                 },
        //                 {
        //                     onSuccess: () => {
        //                         console.log("Status berhasil diupdate di backend");
        //                         // Redirect atau refresh halaman jika perlu
        //                         // router.visit(route('dashboard')); // contoh redirect
        //                     },
        //                     onError: (errors) => {
        //                         console.error(
        //                             "Error updating payment status:",
        //                             errors
        //                         );
        //                         setPaymentStatus(pembayaran.status); // rollback jika error
        //                     },
        //                     onFinish: () => {
        //                         setIsProcessing(false);
        //                     },
        //                 }
        //             );
        //         },
        //         onPending: function (result) {
        //             console.log("Pembayaran pending:", result);
        //             setPaymentStatus("pending");

        //             // Optional: Update backend untuk status pending
        //             post(route("pembayaran.update", pembayaran.id), {
        //                 status: "pending",
        //                 transaction_id: result.transaction_id,
        //                 order_id: result.order_id,
        //             });

        //             setIsProcessing(false);
        //         },
        //         onError: function (result) {
        //             console.log("Terjadi error:", result);
        //             alert("Terjadi kesalahan dalam pembayaran. Silakan coba lagi.");
        //             setIsProcessing(false);
        //         },
        //         onClose: function () {
        //             console.log("Popup ditutup tanpa menyelesaikan pembayaran");
        //             setIsProcessing(false);
        //         },
        //     });
    };

    // Format currency to IDR
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(amount);
    };

    // Status badge component
    const StatusBadge = ({ status }) => {
        const getStatusColor = (status) => {
            switch (status) {
                case "lunas":
                    return "bg-green-100 text-green-800 border-green-200";
                case "pending":
                    return "bg-yellow-100 text-yellow-800 border-yellow-200";
                case "belum_bayar":
                    return "bg-red-100 text-red-800 border-red-200";
                default:
                    return "bg-gray-100 text-gray-800 border-gray-200";
            }
        };

        return (
            <div
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                    status
                )}`}
            >
                Status:{" "}
                {status === "lunas"
                    ? "Lunas"
                    : status === "pending"
                    ? "Pending"
                    : "Belum Bayar"}
            </div>
        );
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
                    {/* Status Badge */}
                    <div className="text-center">
                        <StatusBadge status={paymentStatus} />
                    </div>

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

                    {/* Payment Button */}
                    {paymentStatus !== "lunas" && (
                        <button
                            onClick={checkout}
                            disabled={isProcessing || processing}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300 active:scale-95 disabled:transform-none disabled:shadow-none"
                        >
                            <div className="flex items-center justify-center space-x-2">
                                {isProcessing || processing ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    <>
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
                                        <span>Bayar Sekarang</span>
                                    </>
                                )}
                            </div>
                        </button>
                    )}

                    {/* Success Message */}
                    {paymentStatus === "lunas" && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                            <div className="flex items-center justify-center space-x-2 text-green-800 mb-2">
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
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                <span className="font-semibold">
                                    Pembayaran Berhasil!
                                </span>
                            </div>
                            <p className="text-sm text-green-700">
                                Terima kasih, pembayaran Anda telah berhasil
                                diproses.
                            </p>
                        </div>
                    )}

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
