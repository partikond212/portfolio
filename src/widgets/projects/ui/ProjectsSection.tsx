import React, { Suspense, type FC } from "react";
import ProjectsDecor from "./ProjectsDecor";
import ProjectsList from "./projects-list/ProjectsList";

const ProjectsSection: FC = () => {
  return (
    <section
      id="projects"
      className="relative px-[clamp(20px,5vw,64px)] pb-28 pt-16"
    >
      <ProjectsDecor />
      <div className="relative z-10 mx-auto max-w-[1184px]">
        <Suspense fallback={<p>...Загрузка</p>}>
          <ProjectsList />
        </Suspense>
      </div>
    </section>
  );
};

export default ProjectsSection;
