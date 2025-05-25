import WelcomeLayout from "@/Layouts/WelcomeLayout";
import React from "react";

const Order = () => {
    return (
        <WelcomeLayout>
            <div className="min-h-screen bg-gray-100 py-10 px-6">
                <h1 className="text-center text-2xl font-bold border-b pb-4 mb-10">
                    Checkout
                </h1>

                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Metode Pembayaran */}
                    <div className="md:col-span-2">
                        <h2 className="text-lg font-semibold mb-4">
                            Metode Pembayaran
                        </h2>
                        <div className="space-y-3">
                            <div className="bg-gray-200 p-4 rounded">
                                Metode Pembayaran 1
                            </div>
                            <div className="bg-gray-200 p-4 rounded">
                                Metode Pembayaran 2
                            </div>
                            <div className="bg-gray-200 p-4 rounded">
                                Metode Pembayaran 3
                            </div>
                        </div>
                    </div>

                    {/* Ringkasan Kursus */}
                    <div className="bg-white border rounded p-4 shadow">
                        <div className="w-full h-40 bg-gray-300 flex items-center justify-center text-sm text-gray-600 mb-4">
                            Gambar Ilustrasi
                        </div>
                        <h3 className="text-lg font-semibold">Judul Kursus</h3>
                        <p className="text-gray-700 mb-4">Rp1.000.000,00</p>
                        <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
                            Bayar
                        </button>
                    </div>
                </div>
            </div>
        </WelcomeLayout>
    );
};

export default Order;
