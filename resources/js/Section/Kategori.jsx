import React from "react";

const Kategori = ({ kategori, setFilter }) => {
    return (
        <div className="py-10 px-4 md:px-10 bg-gray-50">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                Kategori
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {kategori.map((kategori, index) => (
                    <div
                        key={index}
                        onClick={() => setFilter(kategori)}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200"
                    >
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-blue-600 mb-2">
                                {kategori}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Kategori;
