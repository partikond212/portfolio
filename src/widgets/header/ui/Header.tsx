import Image from "next/image";
import type { FC } from "react";
import { siteConfig } from "@/shared/config/site";

const Header: FC = () => {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-[clamp(20px,5vw,64px)] py-6">
      <div className="flex items-center gap-3.5">
        <Image
          src="/logo-mark.png"
          alt=""
          width={46}
          height={46}
          priority
          className="size-[46px]"
        />
        <div>
          <div className="text-lg font-semibold leading-tight">
            {siteConfig.name}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span
              aria-hidden="true"
              className="size-[9px] rounded-full bg-[#2f7a3e]"
            />
            на связи
          </div>
        </div>
      </div>
      <nav className="flex flex-wrap gap-7">
        <a href="#projects" className="text-base font-medium">
          Проекты
        </a>
        <a href="#contact" className="text-base font-medium">
          Написать
        </a>
      </nav>
    </header>
  );
};

export default Header;
