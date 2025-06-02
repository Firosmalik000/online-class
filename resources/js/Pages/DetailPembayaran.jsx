import React from "react";
import { initSnap, useSnap } from "midtrans-snap";
import { useForm, usePage } from "@inertiajs/react";

const DetailPembayaran = ({ pembayaran }) => {
    console.log(pembayaran);
    const { env } = usePage().props;
    const { data, processing, post } = useForm({
        id: pembayaran.id,
        status: pembayaran.status,
    });

    initSnap(env.midtrans_client_key, "sandbox" /* or 'production' */);

    const checkout = async () => {
        try {
            const snap = useSnap();
            const result = await snap.pay(pembayaran.snap_token);

            if (result.transaction_status !== "pending") {
                console.log(result);

                data.status = "lunas";
                post(route("pendaftaran.update", data));
            }
        } catch (error) {
            if (isCancel(error)) {
                console.log(
                    "Customer closed the popup without finishing the payment"
                );
            } else {
                console.log("Payment error");
            }
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
                            {formatCurrency(pembayaran.pendaftaran.kelas.harga)}
                        </span>
                    </div>
                </div>

                {/* Payment Button */}
                <button
                    onClick={checkout}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300 active:scale-95"
                >
                    <div className="flex items-center justify-center space-x-2">
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
                        Didukung oleh Midtrans - Platform pembayaran terpercaya
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DetailPembayaran;
