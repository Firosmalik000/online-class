import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Button } from "@/Components/ui/button";
import GuestLayout from "@/Layouts/GuestLayout";
import { Textarea } from "@headlessui/react";
import { Head, Link, useForm } from "@inertiajs/react";
import Swal from "sweetalert2";

// ...import tetap sama
export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        telepon: "",
        alamat: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("register"), {
            onSuccess: () => {
                Swal.fire("Berhasil!", "Registrasi berhasil.", "success");
                reset();
            },
            onFinish: () => reset("password", "password_confirmation"),
            onError: (errors) =>
                Object.keys(errors).length > 0 &&
                alert(Object.values(errors)[0]),
        });
    };

    return (
        <>
            <Head title="Register" />
            <div
                className="min-h-screen flex flex-col md:flex-row bg-cover bg-center"
                style={{ backgroundImage: "url('/Image/log.jpg')" }}
            >
                {/* Card Register */}
                <div className="w-full md:w-1/2 flex items-center justify-center h-screen bg-white/80 backdrop-blur-sm">
                    <form
                        onSubmit={submit}
                        className="w-full max-w-md bg-white/90 p-10 rounded-2xl shadow-2xl"
                    >
                        <h2 className="text-4xl font-extrabold text-indigo-700 mb-8 text-center">
                            Create Account
                        </h2>

                        {/* Name */}
                        <div className="mb-5">
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

                        {/* Telepon */}
                        <div className="mb-5">
                            <InputLabel htmlFor="telepon" value="Telepon" />
                            <TextInput
                                type="tel"
                                id="telepon"
                                name="telepon"
                                value={data.telepon}
                                className="mt-1 block w-full"
                                autoComplete="tel"
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
                        <div className="mb-5">
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="email"
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

                        {/* Passwords */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="mb-5">
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
                            <div className="mb-5">
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

                        {/* Alamat */}
                        <div className="mb-5">
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

                        {/* Action */}
                        <div className="flex items-center justify-between mt-6">
                            <Link
                                href={route("login")}
                                className="text-sm text-indigo-600 hover:underline transition duration-150 ease-in-out"
                            >
                                Already registered?
                            </Link>

                            <Button
                                type="submit"
                                className="ml-4 transition duration-150 ease-in-out bg-indigo-700"
                                disabled={processing}
                            >
                                Register
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Bagian kanan untuk background visual saja */}
                <div className="hidden md:flex md:w-1/2 h-screen" />
            </div>
        </>
    );
}
