import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import Swal from "sweetalert2";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onSuccess: () => {
                Swal.fire("Berhasil!", "Login berhasil.", "success");
                reset();
            },
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Log in" />
            <div className="min-h-screen flex bg-white">
                {/* Left: Background Image */}
                <div
                    className="hidden md:block w-1/2 bg-cover bg-center"
                    style={{ backgroundImage: "url('/Image/log.jpg')" }}
                ></div>

                {/* Right: Login Card */}
                <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 rounded-2xl">
                    <div className="w-full h-full flex items-center justify-center px-8 py-12">
                        <div className="w-full max-w-lg   p-10">
                            <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
                                Welcome Back!
                            </h2>
                            <p className="text-gray-600 text-center mb-8">
                                Please log in to your account.
                            </p>

                            {status && (
                                <div className="mb-4 text-sm font-medium text-green-600 text-center">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <InputLabel htmlFor="email" value="Email" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full"
                                        autoComplete="username"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                    />
                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
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
                                        autoComplete="current-password"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                    />
                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData(
                                                    "remember",
                                                    e.target.checked
                                                )
                                            }
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                                            Remember me
                                        </span>
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href={route("password.request")}
                                            className="text-sm text-indigo-600 hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>

                                <div>
                                    <PrimaryButton
                                        className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-2"
                                        disabled={processing}
                                    >
                                        Log in
                                    </PrimaryButton>
                                </div>

                                <p className="text-sm text-center text-gray-600 mt-4">
                                    Don’t have an account?{" "}
                                    <Link
                                        href={route("register")}
                                        className="text-indigo-600 hover:underline font-medium"
                                    >
                                        Register
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
