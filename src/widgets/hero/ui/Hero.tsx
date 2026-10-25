import React, { type FC } from "react";
import ChatThread from "./chat-thread/ChatThread";
import HeroDecor from "./HeroDecor";

const Hero: FC = () => {
  return (
    <section className=" relative overflow-hidden">
      <HeroDecor />
      <div className="relative mx-auto flex w-full max-w-[1312px] flex-wrap items-start gap-14 px-[clamp(20px,5vw,64px)] pb-20 pt-12">
        <div className="min-w-0 flex-[1_1_420px] relative">
          <h1 className="mb-7 font-display text-[length:clamp(28px,3.4vw,46px)] font-extrabold leading-[1.12]">
            <span className="line hero-line">
              <span style={{ animationDelay: "0.1s" }}>Расскажите,</span>
            </span>
            <span className="line hero-line">
              <span style={{ animationDelay: "0.22s" }}>что продаёте.</span>
            </span>
            <span className="line hero-line">
              <span style={{ animationDelay: "0.34s" }}>Остальное</span>
            </span>
            <span className="line hero-line">
              <span style={{ animationDelay: "0.5s" }}>сделаю я.</span>
            </span>
          </h1>

          <p className="hero-p mb-[22px] max-w-[40ch] text-xl leading-[1.55]">
            Сайты и интернет-магазины под ключ — без технического жаргона и
            лишних посредников.
          </p>

          <svg
            width="170"
            height="26"
            viewBox="0 0 170 26"
            aria-hidden="true"
            className="block"
          >
            <path
              className="squiggle"
              pathLength="100"
              d="M3 13 Q 16 0 29 13 T 55 13 T 81 13 T 107 13 T 133 13 T 159 13"
              fill="none"
              stroke="#2A1B33"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <ChatThread />
      </div>
    </section>
  );
};

export default Hero;
