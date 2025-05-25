import { Head } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import WelcomeLayout from "@/Layouts/WelcomeLayout";

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <WelcomeLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
                    {/* Profile & Password Update */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <section className="bg-white p-6 shadow rounded-2xl">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </section>

                        <section className="bg-white p-6 shadow rounded-2xl">
                            <UpdatePasswordForm className="max-w-xl" />
                        </section>
                    </div>

                    {/* Delete Account */}
                    <section className="bg-white p-6 shadow rounded-2xl">
                        <DeleteUserForm className="max-w-xl" />
                    </section>
                </div>
            </div>
        </WelcomeLayout>
    );
}
