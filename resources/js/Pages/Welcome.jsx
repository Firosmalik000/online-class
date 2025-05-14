import WelcomeLayout from "@/Layouts/WelcomeLayout";
import EventSection from "@/Section/EventSection";
import Hero from "@/Section/Hero";
import { Head } from "@inertiajs/react";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <WelcomeLayout>
            <Head title="Welcome" />
            <div className="flex min-h-screen flex-col items-center justify-center  text-gray-700 px-4">
                <Hero />
                <EventSection />
            </div>
        </WelcomeLayout>
    );
}
