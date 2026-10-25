import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/shared/lib/prisma";
import { verifySession } from "@/shared/lib/dal";
import EditProjectForm from "@/features/edit-project/ui/EditProjectForm";

export const instant = false;

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await verifySession();
  const { id } = await params;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl p-5 sm:p-8">
      <Link
        href="/admin"
        className="font-semibold underline decoration-2 underline-offset-4"
      >
        Назад в админку
      </Link>
      <h1 className="mb-8 mt-6 font-display text-2xl font-semibold">
        Редактирование проекта
      </h1>
      <EditProjectForm project={project} />
    </main>
  );
}
