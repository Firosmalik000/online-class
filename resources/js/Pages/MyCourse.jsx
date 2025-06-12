import DashboardLayout from "@/Layouts/DashboardLayout";
import React from "react";

const MyCourse = ({ kursus }) => {
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

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-semibold m-6 text-gray-800">
                Kursus Saya
            </h1>
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm uppercase tracking-wider">
                            <th className="py-3 px-5 text-left">No</th>
                            <th className="py-3 px-5 text-left">Nama Kelas</th>
                            <th className="py-3 px-5 text-left">Kategori</th>
                            <th className="py-3 px-5 text-left">Jadwal</th>
                            <th className="py-3 px-5 text-left">Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {kursus.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center py-6 text-gray-500"
                                >
                                    Belum ada kursus yang diikuti.
                                </td>
                            </tr>
                        ) : (
                            kursus.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-gray-50 transition duration-200 text-sm text-gray-700 border-b"
                                >
                                    <td className="py-3 px-5">{index + 1}</td>
                                    <td className="py-3 px-5 font-medium">
                                        {item.pendaftaran?.kelas?.nama_kelas ||
                                            "-"}
                                    </td>
                                    <td className="py-3 px-5">
                                        {item.pendaftaran?.kelas?.kategori ||
                                            "-"}
                                    </td>
                                    <td className="py-3 px-5">
                                        {item.pendaftaran?.kelas?.jadwal
                                            ? formatDate(
                                                  item.pendaftaran.kelas.jadwal
                                              )
                                            : "-"}
                                    </td>{" "}
                                    <td className="py-3 px-5">
                                        {item.pendaftaran?.kelas?.link_zoom ? (
                                            <a
                                                href={
                                                    item.pendaftaran.kelas
                                                        .link_zoom
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-4 py-2 rounded-lg shadow transition duration-200"
                                            >
                                                Masuk Zoom
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 text-sm italic">
                                                Belum tersedia
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

export default MyCourse;
