import type { FC } from "react";
import ReadTicks from "./components/ReadTicks";

const ChatThread: FC = () => {
  return (
    <div className="min-w-0 flex-[1_1_380px] relative">
      <div className="flex flex-col gap-(--chat-gap) [--chat-gap:12px] max-[950px]:[--chat-gap:24px]">
        <div className="m1 max-w-[86%] self-start rounded-[22px_22px_22px_6px] bg-paper px-[18px] py-3.5 text-[17px] leading-normal">
          Здравствуйте! Хочу интернет-магазин, но я совсем не знаю с чего
          начать(
        </div>

        <div className="typing self-end" aria-hidden="true">
          <div className="flex gap-1.5 rounded-[22px_22px_6px_22px] bg-ink px-[18px] py-4">
            <span className="dot block size-2 rounded-full bg-paper" />
            <span className="dot block size-2 rounded-full bg-paper" />
            <span className="dot block size-2 rounded-full bg-paper" />
          </div>
        </div>

        <div className="m2 max-w-[86%] self-end rounded-[22px_22px_6px_22px] bg-ink px-[18px] py-3.5 text-[17px] leading-normal text-paper">
          Привет, я Артём. Техническую часть беру на себя — вам нужно только
          рассказать, что вы продаёте и кому.
          <ReadTicks />
        </div>
        <div className="m3 max-w-[86%] self-end rounded-[22px_22px_6px_22px] bg-ink px-[18px] py-3.5 text-[17px] leading-normal text-paper">
          Вот несколько моих работ - загляните ниже
          <ReadTicks />
        </div>
      </div>

      <div className="chips mt-[18px] flex flex-wrap justify-end gap-2.5">
        <a
          href="#projects"
          className="inline-flex min-h-11 items-center rounded-full border-2 border-ink px-[22px] text-base font-semibold transition-colors hover:bg-ink hover:text-paper"
        >
          Смотреть работы
        </a>
        <a
          href="#contact"
          className="inline-flex min-h-11 items-center rounded-full border-2 border-ink bg-ink px-[22px] text-base font-semibold text-paper transition-colors hover:border-tomato hover:bg-tomato"
        >
          Написать мне
        </a>
      </div>
    </div>
  );
};

export default ChatThread;
