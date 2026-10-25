"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type FC,
  type KeyboardEvent,
  type MouseEvent,
  type TouchEvent,
} from "react";

type ImageLightboxProps = {
  images: string[];
  title: string;
  startIndex: number;
  onClose: (lastIndex: number) => void;
};

const buttonClass =
  "absolute flex size-11 items-center justify-center rounded-full bg-paper/90 text-ink transition-colors hover:bg-paper";

const ImageLightbox: FC<ImageLightboxProps> = ({
  images,
  title,
  startIndex,
  onClose,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [index, setIndex] = useState(startIndex);
  const indexRef = useRef(startIndex);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const show = (next: number) => {
    setIndex((next + images.length) % images.length);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "ArrowRight") show(index + 1);
    if (event.key === "ArrowLeft") show(index - 1);
  };

  // Клик по фону (мимо кнопок) закрывает окно
  const onBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) dialogRef.current?.close();
  };

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) > 50) show(index + (delta < 0 ? 1 : -1));
  };

  const multiple = images.length > 1;

  return (
    <dialog
      ref={dialogRef}
      aria-label={`Скриншоты проекта «${title}»`}
      onClose={() => onClose(indexRef.current)}
      onKeyDown={onKeyDown}
      className="m-0 h-dvh max-h-none w-dvw max-w-none overflow-hidden border-0 bg-ink/95 p-0 text-paper backdrop:bg-transparent"
    >
      <div
        onClick={onBackdropClick}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative h-full w-full p-4 sm:p-12"
      >
        <div className="pointer-events-none relative h-full w-full">
          <Image
            key={images[index]}
            src={images[index]}
            alt={`${title} — скриншот ${index + 1} из ${images.length}`}
            fill
            sizes="100vw"
            quality={90}
            className="object-contain"
          />
        </div>

        <button
          type="button"
          aria-label="Закрыть"
          onClick={() => dialogRef.current?.close()}
          className={`${buttonClass} right-3 top-3`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {multiple && (
          <>
            <button
              type="button"
              aria-label="Предыдущий скриншот"
              onClick={() => show(index - 1)}
              className={`${buttonClass} left-3 top-1/2 -translate-y-1/2`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
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
            <button
              type="button"
              aria-label="Следующий скриншот"
              onClick={() => show(index + 1)}
              className={`${buttonClass} right-3 top-1/2 -translate-y-1/2`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
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
            <p
              aria-live="polite"
              className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-sm font-semibold"
            >
              {index + 1} / {images.length}
            </p>
          </>
        )}
      </div>
    </dialog>
  );
};

export default ImageLightbox;
