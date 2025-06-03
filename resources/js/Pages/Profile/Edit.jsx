import { Head } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import DashboardLayout from "@/Layouts/DashboardLayout";

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <DashboardLayout
            header={
                <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                {/* Profile & Password Update */}
                <section className="bg-white p-6 shadow rounded-2xl">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                </section>

                <section className="bg-white p-6 shadow rounded-2xl">
                    <UpdatePasswordForm />
                </section>

                {/* Delete Account */}
                <section className="bg-white p-6 shadow rounded-2xl">
                    <DeleteUserForm />
                </section>
            </div>
        </DashboardLayout>
    );
}
