import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Textarea } from "@headlessui/react";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        telpon: "",
        alamat: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
            onError: (errors) => Object.keys(errors).length > 0 && alert(Object.values(errors)[0]),
        });
    };

    return (
        <>
            <Head title="Register" />
            <div className="min-h-screen flex flex-col md:flex-row bg-white h-screen">
                {/* Gambar Kiri */}
                <div className="hidden md:block md:w-1/2">
                    <img
                        src="/Image/register.png"
                        alt="Register Illustration"
                        className="object-cover w-full h-full"
                    />
                </div>

                {/* Form Kanan */}
                <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 py-12 px-6 md:px-16">
                    <form
                        onSubmit={submit}
                        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg"
                    >
                        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                            Create Account
                        </h2>

                        {/* Name */}
                        <div className="mb-4">
                            <InputLabel htmlFor="name" value="Name" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>
                        {/* Telpon */}
                        <div className="mb-4">
                            <InputLabel htmlFor="telepon" value="Telpon" />
                            <TextInput
                                type="tel"
                                id="telepon"
                                name="telepon"
                                value={data.telepon}
                                className="mt-1 block w-full"
                                autoComplete="telepon"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("telepon", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.telepon}
                                className="mt-2"
                            />
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                            {/* Password */}
                            <div className="mb-4">
                                <InputLabel
                                    htmlFor="password"
                                    value="Password"
                                />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>

                            {/* Confirm Password */}
                            <div className="mb-4">
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Confirm Password"
                                />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <InputLabel htmlFor="alamat" value="Alamat" />
                            <Textarea
                                id="alamat"
                                name="alamat"
                                value={data.alamat}
                                className="mt-1 block w-full rounded-md"
                                autoComplete="address"
                                rows={3}
                                onChange={(e) =>
                                    setData("alamat", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.alamat}
                                className="mt-2"
                            />
                        </div>

                        {/* Action Button */}
                        <div className="flex items-center justify-between mt-6">
                            <Link
                                href={route("login")}
                                className="text-sm text-indigo-600 hover:underline"
                            >
                                Already registered?
                            </Link>

                            <PrimaryButton
                                className="ml-4"
                                disabled={processing}
                            >
                                Register
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
