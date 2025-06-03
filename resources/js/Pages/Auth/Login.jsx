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
                reset(); // Reset form setelah berhasil
            },
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Log in" />
            <div className="min-h-screen flex flex-col md:flex-row bg-white h-screen">
                {/* Left Image */}
                <div className="hidden md:flex w-1/2 h-full">
                    <img
                        src="/Image/login.png"
                        alt="Login Illustration"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Form Section */}
                <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12">
                    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                            Welcome Back
                        </h2>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600 text-center">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit}>
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

                            <div className="mt-4">
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

                            <div className="mt-4 flex items-center justify-between">
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
                                    <span className="ms-2 text-sm text-gray-600">
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

                            <div className="mt-6">
                                <PrimaryButton
                                    className="w-full justify-center"
                                    disabled={processing}
                                >
                                    Log in
                                </PrimaryButton>
                            </div>

                            <p className="text-sm text-center text-gray-500 mt-6">
                                Don't have an account?{" "}
                                <Link
                                    href={route("register")}
                                    className="text-indigo-600 hover:underline"
                                >
                                    Register
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
