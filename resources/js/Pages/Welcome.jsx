import WelcomeLayout from "@/Layouts/WelcomeLayout";
import EventSection from "@/Section/EventSection";
import Hero from "@/Section/Hero";
import Kategori from "@/Section/Kategori";
import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Welcome() {
    const [filter, setFilter] = useState("semua");
    const { kelas, kategori } = usePage().props;
    return (
        <WelcomeLayout>
            <Head title="Welcome" />

            <Hero />
            <div className="flex min-h-screen flex-col items-center justify-center  text-gray-700 px-24">
                <Kategori kategori={kategori} setFilter={setFilter} />
                <EventSection kelas={kelas} filter={filter} />
            </div>
        </WelcomeLayout>
    );
}
