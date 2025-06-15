import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Button } from "@/Components/ui/button";
import { Transition } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            _method: "patch", // spoofing method PATCH via POST
            name: user.name,
            email: user.email,
            alamat: "",
            foto: null,
            telepon: "",
        });

    const submit = (e) => {
        e.preventDefault();
        post(route("profile.update"), {
            onSuccess: () =>
                Swal.fire(
                    "Berhasil!",
                    "Profil berhasil diperbarui.",
                    "success"
                ),
            onError: () =>
                Swal.fire(
                    "Gagal!",
                    "Gagal memperbarui profil. Silakan coba lagi.",
                    "error"
                ),
            preserveScroll: true,
        });
    };

    return (
        <section className={`bg-white px-6 shadow rounded-xl ${className}`}>
            <header className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                    Informasi Profil
                </h2>
                <p className="text-sm text-gray-600">
                    Perbarui informasi akun dan foto profil Anda.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-6">
                {/* Foto Profil */}
                <div>
                    <InputLabel htmlFor="foto" value="Foto Profil" />
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-2 border border-gray-300 flex items-center justify-center bg-gray-100">
                        <img
                            src={
                                data.foto
                                    ? URL.createObjectURL(data.foto)
                                    : user.foto
                                        ? `/storage/${user.foto}`
                                        : "/default-avatar.png"
                            }
                            alt="Foto Profil"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <input
                        type="file"
                        id="foto"
                        accept="image/*"
                        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        onChange={(e) => setData("foto", e.target.files[0])}
                    />
                    <InputError className="mt-2" message={errors.foto} />
                </div>

                {/* Nama */}
                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                {/* Email */}
                <div>
                    <InputLabel htmlFor="email" value="Alamat Email" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {/* Alamat */}
                <div>
                    <InputLabel htmlFor="alamat" value="Alamat" />
                    <TextInput
                        id="alamat"
                        className="mt-1 block w-full"
                        value={data.alamat}
                        onChange={(e) => setData("alamat", e.target.value)}
                        placeholder="Masukkan alamat lengkap Anda"
                    />
                    <InputError className="mt-2" message={errors.alamat} />
                </div>

                {/* Nomor Telepon */}
                <div>
                    <InputLabel htmlFor="telepon" value="Nomor Telepon" />
                    <TextInput
                        id="telepon"
                        type="tel"
                        className="mt-1 block w-full"
                        value={data.telepon}
                        onChange={(e) => setData("telepon", e.target.value)}
                        placeholder="Contoh: 081234567890"
                    />
                    <InputError className="mt-2" message={errors.telepon} />
                </div>

                {/* Verifikasi Email */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="mt-4 text-sm text-gray-800">
                        <p>
                            Email Anda belum terverifikasi.
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="ml-1 text-sm text-indigo-600 underline hover:text-indigo-900"
                            >
                                Klik di sini untuk mengirim ulang tautan
                                verifikasi.
                            </Link>
                        </p>
                        {status === "verification-link-sent" && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                Tautan verifikasi baru telah dikirim ke alamat
                                email Anda.
                            </div>
                        )}
                    </div>
                )}

                {/* Tombol Submit */}
                <div className="flex items-center gap-4">
                    <Button disabled={processing} className="mb-3">Simpan Perubahan</Button>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition-opacity duration-300"
                        enterFrom="opacity-0"
                        leave="transition-opacity duration-300"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-600 mb-3">
                            Profil berhasil diperbarui!
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
