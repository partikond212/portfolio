import type { Project as ProjectModel } from "@/generated/prisma/client";
import type { FC } from "react";
import ProjectImages from "./components/ProjectImages";

type ProjectProps = {
  project: ProjectModel;
};

const newTabNote = (
  <span className="sr-only"> (откроется в новой вкладке)</span>
);

const Project: FC<ProjectProps> = ({ project }) => {
  return (
    <article className="s-fly min-w-0 flex-[1_1_320px] max-w-[380px] overflow-hidden rounded-[26px_26px_6px_26px] bg-paper even:rounded-[26px_26px_26px_6px]">
      <ProjectImages images={project.images} title={project.title} />
      <div className="p-6">
        <h3 className="mb-2.5 font-display text-xl font-semibold leading-tight">
          {project.title}
        </h3>
        <p className="mb-5 text-base leading-[1.55]">{project.description}</p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {project.siteUrl && (
            <a
              href={project.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 font-semibold text-paper transition-colors hover:bg-tomato"
            >
              Открыть сайт
              {newTabNote}
            </a>
          )}
          <a
            href={project.repoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline decoration-tomato decoration-2 underline-offset-4 transition-colors hover:text-tomato"
          >
            Репозиторий
            {newTabNote}
          </a>
        </div>
      </div>
    </article>
  );
};

export default Project;
