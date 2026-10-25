import React, { type FC } from "react";

const HeroDecor: FC = () => {
  return (
    <>
      <div
        className="absolute -right-35 -top-20 size-[520px] rounded-full bg-paper/40"
        aria-hidden="true"
      ></div>
      <div
        aria-hidden="true"
        className="decor-in absolute bottom-6 size-[132px] bg-[radial-gradient(rgba(42,27,51,0.24)_2.4px,transparent_3px)] bg-[length:22px_22px]"
      />
    </>
  );
};

export default HeroDecor;
