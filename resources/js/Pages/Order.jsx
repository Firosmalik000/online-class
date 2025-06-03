import DashboardLayout from "@/Layouts/DashboardLayout";
import { useForm } from "@inertiajs/react";
import React from "react";

const Order = ({ pembayaran }) => {
    console.log({ pembayaran });
    const { post } = useForm();
    const handleSubmit = (e, id) => {
        e.preventDefault();
        post(`/order/${id}`, {
            onSuccess: () => {
                alert("Pendaftaran berhasil!");
            },
        });
    };
    return (
        <DashboardLayout>
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
                            <img
                                src={"/storage/" + kelas?.banner}
                                alt={kelas?.nama_kelas}
                                className="w-full h-64 object-cover rounded-xl mb-6"
                            />
                        </div>
                        <h3 className="text-lg font-semibold">
                            {kelas?.nama_kelas}
                        </h3>
                        <p className="text-gray-700 mb-4">{kelas?.harga}</p>
                        <button
                            onClick={(e) => handleSubmit(e, kelas?.id_kelas)}
                            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
                        >
                            Bayar
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Order;
