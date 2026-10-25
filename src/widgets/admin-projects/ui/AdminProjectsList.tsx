import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { prisma } from "@/shared/lib/prisma";
import DeleteProjectButton from "@/features/delete-project/ui/DeleteProjectButton";

const AdminProjectsList: FC = async () => {
  const projects = await prisma.project.findMany({ orderBy: { id: "desc" } });

  return (
    <section className="mt-14">
      <h2 className="mb-5 font-display text-xl font-semibold">
        Все проекты ({projects.length})
      </h2>

      {projects.length === 0 ? (
        <p>Проектов пока нет. Добавь первый формой выше.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {projects.map((project) => (
            <li
              key={project.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl bg-paper p-3"
            >
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-ink/10">
                {project.images[0] && (
                  <Image
                    src={project.images[0]}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{project.title}</p>
                <p className="truncate text-sm">{project.repoLink}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/admin/projects/${project.id}/edit`}
                  aria-label={`Изменить проект «${project.title}»`}
                  className="rounded-full bg-ink px-4 py-1.5 text-sm font-semibold text-paper transition-colors hover:bg-tomato"
                >
                  Изменить
                </Link>
                <DeleteProjectButton id={project.id} title={project.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default AdminProjectsList;
