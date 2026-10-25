import { verifySession } from "@/shared/lib/dal";
import LogoutButton from "@/features/admin-login/ui/LogoutButton";
import AddProjectForm from "@/features/add-project/ui/AddProjectForm";
import AdminProjectsList from "@/widgets/admin-projects/ui/AdminProjectsList";
export const instant = false;
export default async function AdminPage() {
  await verifySession();

  return (
    <main className="mx-auto w-full max-w-3xl p-5 sm:p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Админка</h1>
        <LogoutButton />
      </div>
      <AddProjectForm />
      <AdminProjectsList />
    </main>
  );
}
