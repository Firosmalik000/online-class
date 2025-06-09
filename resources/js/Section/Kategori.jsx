import React from "react";
import { motion } from "framer-motion";

const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4, ease: "easeOut" },
    },
    hover: {
        scale: 1.05,
        boxShadow: "0 10px 20px rgba(59, 130, 246, 0.4)",
        transition: { duration: 0.3 },
    },
};

const Kategori = ({ kategori, setFilter }) => {
    return (
        <div className="py-8 px-4 sm:px-6 md:px-10 bg-gray-50">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                Kategori
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {kategori.map((item, index) => (
                    <motion.div
                        key={index}
                        onClick={() => setFilter(item)}
                        className="bg-white rounded-xl border border-gray-200 cursor-pointer flex items-center justify-center text-center p-6"
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        whileHover="hover"
                        transition={{ delay: index * 0.1 }}
                    >
                        <h3 className="text-xl font-semibold text-blue-600">
                            {item}
                        </h3>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Kategori;
