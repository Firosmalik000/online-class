import { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import WelcomeLayout from "@/Layouts/WelcomeLayout";
import Hero from "@/Section/Hero";
import EventSection from "@/Section/EventSection";
import Kategori from "@/Section/Kategori";

export default function Welcome() {
    const [filter, setFilter] = useState("semua");
    const { kelas, kategori, best_sellers } = usePage().props;

    return (
        <WelcomeLayout>
            <Head title="Welcome" />

            <Hero />

            <section className="px-6 md:px-12 lg:px-24 py-12 bg-white text-gray-800">
                <h2 className="text-3xl font-bold text-center mb-8 text-blue-900">
                    Best Sellers Program
                </h2>
                <EventSection kelas={best_sellers} />
            </section>

            <Kategori kategori={kategori} setFilter={setFilter} />

            <section className="px-6 md:px-12 lg:px-24 py-12 bg-white text-gray-800">
                <h2 className="text-3xl font-bold text-center mb-8 text-blue-900">
                    Pelatihan Web Development
                </h2>
                <EventSection kelas={kelas} filter={filter} />
            </section>
        </WelcomeLayout>
    );
}
