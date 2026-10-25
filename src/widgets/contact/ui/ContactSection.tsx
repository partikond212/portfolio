import type { FC } from "react";
import { siteConfig } from "@/shared/config/site";

const ContactSection: FC = () => {
  const { telegram, ...others } = siteConfig.social;
  const otherLinks: { label: string; href: string }[] = [
    { label: "GitHub", href: others.github },
  ];

  return (
    <section
      id="contact"
      className="relative overflow-hidden px-[clamp(20px,5vw,64px)] pb-32 pt-8"
    >
      <div className="relative z-10 mx-auto max-w-[760px] s-pop">
        <h2 className="mb-5 font-display text-[length:clamp(26px,3.4vw,44px)] font-extrabold leading-[1.12]">
          Есть задача? Напишите, обсудим.
        </h2>
        <p className="mb-8 max-w-[40ch] text-xl leading-[1.55]">
          Расскажите, что продаёте или какой нужен сайт, и я отвечу в Telegram.
        </p>

        <a
          href={telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-14 items-center rounded-full bg-tomato px-8 text-lg font-semibold text-paper transition-colors hover:bg-ink"
        >
          Написать в Telegram
          <span className="sr-only"> (откроется в новой вкладке)</span>
        </a>

        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          {otherLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline decoration-2 underline-offset-4 transition-colors hover:text-tomato"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div
        aria-hidden="true"
        className="decor-in absolute right-[6%] top-6 hidden size-[140px] md:block"
      >
        <svg
          className="spin-slow"
          width="140"
          height="140"
          viewBox="0 0 140 140"
        >
          <defs>
            <path
              id="badge-circle"
              d="M70 70 m-52 0 a52 52 0 1 1 104 0 a52 52 0 1 1 -104 0"
            />
          </defs>
          <text
            fontSize="11"
            fontWeight="600"
            letterSpacing="2.6"
            fill="#2A1B33"
            style={{ fontFamily: "var(--font-unbounded)" }}
          >
            <textPath href="#badge-circle">
              принимаю заказы • на связи •{" "}
            </textPath>
          </text>
        </svg>
        <svg
          className="absolute left-0 top-0"
          width="140"
          height="140"
          viewBox="0 0 140 140"
        >
          <circle cx="70" cy="70" r="24" fill="#C93A1E" />
          <rect
            x="58"
            y="62"
            width="24"
            height="16"
            rx="3"
            fill="none"
            stroke="#FFF8EA"
            strokeWidth="2"
          />
          <path
            d="M58 64 L70 72 L82 64"
            fill="none"
            stroke="#FFF8EA"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
};

export default ContactSection;
