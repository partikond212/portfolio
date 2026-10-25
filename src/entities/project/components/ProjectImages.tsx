"use client";

import Image from "next/image";
import { useRef, useState, type FC } from "react";

type ProjectImagesProps = {
  images: string[];
  title: string;
};

const ProjectImages: FC<ProjectImagesProps> = ({ images, title }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const last = images.length - 1;

  const go = (i: number) => {
    const el = ref.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  const onScroll = () => {
    const el = ref.current;
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  if (images.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, i) => (
          <div
            key={src}
            className="relative aspect-[4/3] shrink-0 basis-full snap-center"
          >
            <Image
              loading={"lazy"}
              src={src}
              alt={`${title} — скриншот ${i + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, 380px"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          {index > 0 && (
            <button
              type="button"
              aria-label="Предыдущий скриншот"
              onClick={() => go(index - 1)}
              className="absolute left-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink transition-colors hover:bg-paper"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M15 6l-6 6 6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {index < last && (
            <button
              type="button"
              aria-label="Следующий скриншот"
              onClick={() => go(index + 1)}
              className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink transition-colors hover:bg-paper"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M9 6l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          <div className="absolute inset-x-0 bottom-1.5 flex justify-center">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={`Слайд ${i + 1}`}
                aria-current={i === index}
                onClick={() => go(i)}
                className="p-1.5"
              >
                <span
                  className={`block size-2.5 rounded-full transition-colors ${
                    i === index ? "bg-ink" : "bg-paper/80"
                  }`}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectImages;
