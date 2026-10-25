import type { FC } from "react";

const ReadTicks: FC = () => {
  return (
    <svg
      width="18"
      height="10"
      viewBox="0 0 18 10"
      aria-hidden="true"
      className="ml-2 inline-block align-[-1px] opacity-70"
    >
      <path
        d="M1 5.5 L4.5 9 L11 1.5 M6.5 8 L8.5 9 L16 1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ReadTicks;
