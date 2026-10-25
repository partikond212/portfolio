import type { Project as ProjectModel } from "@/generated/prisma/client";
import type { FC } from "react";
import ProjectImages from "./components/ProjectImages";

type ProjectProps = {
  project: ProjectModel;
};

const Project: FC<ProjectProps> = ({ project }) => {
  return (
    <article className="card s-fly min-w-0 flex-[1_1_320px] max-w-[380px] overflow-hidden rounded-[26px_26px_6px_26px] bg-paper even:rounded-[26px_26px_26px_6px]">
      <ProjectImages images={project.images} title={project.title} />
      <div className="p-6">
        <h3 className="mb-2.5 font-display text-xl font-semibold leading-tight">
          {project.title}
        </h3>
        <p className="mb-4 text-base leading-[1.55]">{project.description}</p>
        <a
          href={project.repoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline decoration-tomato decoration-2 underline-offset-4 transition-colors hover:text-tomato"
        >
          Смотреть проект
          <span className="sr-only"> «{project.title}» (откроется в новой вкладке)</span>
        </a>
      </div>
    </article>
  );
};

export default Project;
