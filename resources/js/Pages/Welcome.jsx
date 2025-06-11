import WelcomeLayout from "@/Layouts/WelcomeLayout";
import EventSection from "@/Section/EventSection";
import Hero from "@/Section/Hero";
import Kategori from "@/Section/Kategori";
import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Welcome() {
    const [filter, setFilter] = useState("semua");
    const { kelas, kategori, best_sellers } = usePage().props;

    return (
        <WelcomeLayout>
            <Head title="Welcome" />

            <Hero />
            <div className="flex min-h-screen flex-col items-center justify-center  text-gray-700 px-24">
                <div className="">
                    <h2 className="text-3xl font-bold text-center my-4 text-blue-900">
                        Best Sellers Program
                    </h2>
                    <EventSection kelas={best_sellers} />
                </div>
                <Kategori kategori={kategori} setFilter={setFilter} />
                <div className="">
                    <h2 className="text-3xl font-bold text-center mb-4 text-blue-900">
                        Pelatihan Web Development
                    </h2>
                    <EventSection kelas={kelas} filter={filter} />
                </div>
            </div>
        </WelcomeLayout>
    );
}
