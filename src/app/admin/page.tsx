import { verifySession } from "@/shared/lib/dal";
import LogoutButton from "@/features/admin-login/ui/LogoutButton";
import AddProjectForm from "@/features/add-project/ui/AddProjectForm";
export const instant = false;
export default async function AdminPage() {
  await verifySession();

  return (
    <main className="mx-auto max-w-3xl p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Админка</h1>
        <LogoutButton />
      </div>
      <AddProjectForm />
    </main>
  );
}
