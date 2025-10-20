import { usePage } from '@inertiajs/react';

export default function ApplicationLogo(props) {
    const { asset } = usePage().props; // pastikan asset helper dikirim dari backend jika perlu

    return (
        <img
            src="/image/logo-online-class.jpg"
            alt="Logo"
            className="h-10 w-auto"
            {...props}
        />
    );
}
