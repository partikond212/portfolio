import type { FC } from "react";

const ProjectsDecor: FC = () => {
  return (
    <>
      <div
        aria-hidden="true"
        className="float absolute bottom-24 right-[3%] size-[68px] max-md:hidden rounded-[50%_50%_50%_10px] bg-tomato [--r:10deg]"
      />

      <div
        aria-hidden="true"
        className="float absolute bottom-45 left-[4%] size-[46px] max-md:hidden rounded-[50%_50%_10px_50%] bg-ink [--r:-8deg]"
      />
      <div
        aria-hidden="true"
        className="float absolute left-[2.5%] top-30 size-[72px] max-md:hidden rounded-full border-[9px] border-ink [--r:0deg]"
      />

      <div
        aria-hidden="true"
        className="spin-slow absolute right-[4%] top-20 size-11"
      >
        <span className="absolute left-[19px] top-0 h-11 w-1.5 rounded-[3px] bg-ink" />
        <span className="absolute left-0 top-[19px] h-1.5 w-11 rounded-[3px] bg-ink" />
      </div>
    </>
  );
};

export default ProjectsDecor;
