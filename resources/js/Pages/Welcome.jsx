import WelcomeLayout from "@/Layouts/WelcomeLayout";
import { Head } from "@inertiajs/react";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById("screenshot-container")
            ?.classList.add("hidden");
        document.getElementById("docs-card")?.classList.add("!row-span-1");
        document
            .getElementById("docs-card-content")
            ?.classList.add("!flex-row");
        document.getElementById("background")?.classList.add("hidden");
    };

    return (
        <WelcomeLayout>
            <Head title="Welcome" />
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-gray-700 px-4">
                <div className="max-w-4xl text-center">
                    <h1 className="text-4xl font-bold mb-4 text-[#FF2D20]">
                        Welcome to Your App
                    </h1>
                    <p className="text-lg mb-8">
                        This project is powered by{" "}
                        <strong>Laravel {laravelVersion}</strong> and{" "}
                        <strong>PHP {phpVersion}</strong>.
                    </p>
                    <img
                        id="screenshot-container"
                        onError={handleImageError}
                        src="/images/preview.png"
                        alt="Preview"
                        className="rounded shadow-lg max-w-full"
                    />
                </div>
            </div>
        </WelcomeLayout>
    );
}
