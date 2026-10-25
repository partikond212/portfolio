import Project from "@/entities/project/Project";
import { prisma } from "@/shared/lib/prisma";
import { type FC } from "react";

const ProjectsList: FC = async () => {
  const projects = await prisma.project.findMany({ orderBy: { id: "desc" } });

  return (
    <>
      <div className="mb-14 flex justify-center">
        <h2 className="s-pop rounded-full bg-paper px-6 py-2.5 text-base font-semibold">
          Вот что я уже делал
        </h2>
      </div>

      {projects.length === 0 ? (
        <p className="text-center text-lg">
          Скоро здесь появятся проекты. Загляни чуть позже.
        </p>
      ) : (
        <div className="flex flex-wrap items-start justify-center gap-8">
          {projects.map((p) => (
            <Project key={p.id} project={p} />
          ))}
        </div>
      )}
    </>
  );
};

export default ProjectsList;
