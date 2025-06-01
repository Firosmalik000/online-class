import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            alamat: user.alamat || "",
            foto: user.foto || "",
            telepon: user.telepon || "",
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route("profile.update"), {
            preserveScroll: true,
        });
    };
    console.log({ data });
    return (
        <section className={`bg-white p-6 shadow rounded-xl ${className}`}>
            <header className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                    Profile Information
                </h2>
                <p className="text-sm text-gray-600">
                    Update your profile information, including email, address,
                    phone, and profile photo.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-6">
                {/* Name */}
                {/* Foto Profil */}
                <div>
                    <InputLabel htmlFor="foto" value="Foto Profil" />

                    {/* Avatar Preview */}
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
                        <img
                            src={
                                data.foto
                                    ? URL.createObjectURL(data.foto)
                                    : user.profile_photo_url ||
                                      "/default-avatar.png"
                            }
                            alt="Foto Profil"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <input
                        type="file"
                        id="foto"
                        className="block w-full text-sm text-gray-600"
                        onChange={(e) => setData("foto", e.target.files[0])}
                    />
                    <InputError className="mt-2" message={errors.photo} />
                </div>

                <div>
                    <InputLabel htmlFor="name" value="Name" />
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
                    <InputLabel htmlFor="email" value="Email" />
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

                {/* Address */}
                <div>
                    <InputLabel htmlFor="alamat" value="Alamat" />
                    <TextInput
                        id="alamat"
                        className="mt-1 block w-full"
                        value={data.address}
                        onChange={(e) => setData("alamat", e.target.value)}
                        placeholder="Masukkan alamat lengkap"
                    />
                    <InputError className="mt-2" message={errors.address} />
                </div>

                {/* Phone */}
                <div>
                    <InputLabel htmlFor="telepon" value="Telepon" />
                    <TextInput
                        id="telepon"
                        type="tel"
                        className="mt-1 block w-full"
                        value={data.telepon}
                        onChange={(e) => setData("telepon", e.target.value)}
                        placeholder="08xxxxxxxxxx"
                    />
                    <InputError className="mt-2" message={errors.phone} />
                </div>

                {/* Photo Upload */}

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Email Anda belum terverifikasi.
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="ml-1 text-sm text-indigo-600 underline hover:text-indigo-900"
                            >
                                Klik di sini untuk verifikasi ulang.
                            </Link>
                        </p>

                        {status === "verification-link-sent" && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                Tautan verifikasi baru telah dikirim ke email
                                Anda.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Simpan</PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition-opacity duration-300"
                        enterFrom="opacity-0"
                        leave="transition-opacity duration-300"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-600">Tersimpan.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
