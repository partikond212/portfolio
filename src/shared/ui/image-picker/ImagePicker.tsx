"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";

const MAX_WIDTH = 1600;

type Item = { id: string; file: File; url: string };

const formatMb = (bytes: number) => (bytes / 1024 / 1024).toFixed(1);

// Уменьшает скриншот и переводит в WebP; если лучше не стало, оставляет оригинал
async function compress(file: File): Promise<File> {
  if (!/^image\/(png|jpe?g|webp)$/.test(file.type)) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_WIDTH / bitmap.width);
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.88),
    );
    if (!blob || blob.size >= file.size) return file;

    const baseName = file.name.replace(/\.[^.]+$/, "") || "screenshot";
    return new File([blob], `${baseName}.webp`, { type: "image/webp" });
  } catch {
    return file;
  }
}

type ImagePickerProps = {
  name: string;
  label?: string;
  maxFiles?: number;
  maxTotalBytes?: number;
};

export default function ImagePicker({
  name,
  label = "Скриншоты",
  maxFiles = 6,
  maxTotalBytes = 4 * 1024 * 1024,
}: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<Item[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [notice, setNotice] = useState("");

  // Единый способ изменить список: состояние, ref и сам <input type="file">,
  // из которого форма потом берёт файлы при отправке
  const commit = useCallback((next: Item[]) => {
    itemsRef.current = next;
    setItems(next);
    const transfer = new DataTransfer();
    next.forEach((item) => transfer.items.add(item.file));
    if (inputRef.current) inputRef.current.files = transfer.files;
  }, []);

  const addFiles = useCallback(
    async (incoming: File[]) => {
      const images = incoming.filter((file) => file.type.startsWith("image/"));
      if (images.length === 0) {
        commit(itemsRef.current);
        setNotice("Это не картинка: можно добавлять только изображения.");
        return;
      }

      const prepared = await Promise.all(images.map(compress));
      const current = itemsRef.current;
      const accepted: Item[] = [];
      let total = current.reduce((sum, item) => sum + item.file.size, 0);
      let skipped = 0;

      for (const file of prepared) {
        const tooMany = current.length + accepted.length >= maxFiles;
        const tooBig = total + file.size > maxTotalBytes;
        if (tooMany || tooBig) {
          skipped += 1;
          continue;
        }
        total += file.size;
        accepted.push({
          id: crypto.randomUUID(),
          file,
          url: URL.createObjectURL(file),
        });
      }

      setNotice(
        skipped > 0
          ? `Не добавлено: ${skipped}. Лимит — ${maxFiles} картинок и ${formatMb(maxTotalBytes)} МБ вместе.`
          : "",
      );
      commit([...current, ...accepted]);
    },
    [commit, maxFiles, maxTotalBytes],
  );

  const removeItem = (id: string) => {
    const target = itemsRef.current.find((item) => item.id === id);
    if (target) URL.revokeObjectURL(target.url);
    setNotice("");
    commit(itemsRef.current.filter((item) => item.id !== id));
  };

  // Ctrl+V с картинкой в буфере обмена работает в любом месте страницы.
  // Обычную вставку текста в поля не трогаем.
  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const files = Array.from(event.clipboardData?.files ?? []).filter(
        (file) => file.type.startsWith("image/"),
      );
      if (files.length === 0) return;
      event.preventDefault();
      void addFiles(files);
    };
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [addFiles]);

  // После отправки форма делает reset(): очищаем и наш список
  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) return;
    const onReset = () => {
      itemsRef.current.forEach((item) => URL.revokeObjectURL(item.url));
      itemsRef.current = [];
      setItems([]);
      setNotice("");
    };
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, []);

  useEffect(() => {
    return () => {
      itemsRef.current.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, []);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    void addFiles(Array.from(event.target.files ?? []));
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    void addFiles(Array.from(event.dataTransfer.files));
  };

  const total = items.reduce((sum, item) => sum + item.file.size, 0);

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={name}>{label}</label>

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
        className="flex flex-col gap-3 rounded-xl border-2 border-dashed border-ink/40 bg-paper p-4"
      >
        <p className="text-sm">
          Вставь скриншот через <b>Ctrl+V</b>, перетащи сюда или выбери файлы.
          Большие картинки сожмутся автоматически.
        </p>
        <input
          ref={inputRef}
          id={name}
          name={name}
          type="file"
          accept="image/*"
          multiple
          onChange={onChange}
          className="cursor-pointer text-sm file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-ink file:px-5 file:py-2 file:text-sm file:font-semibold file:text-paper file:transition-colors hover:file:bg-tomato"
        />
      </div>

      <p className="text-sm" aria-live="polite">
        Выбрано: {items.length} из {maxFiles}, {formatMb(total)} МБ из{" "}
        {formatMb(maxTotalBytes)} МБ
        {notice && <span className="block font-semibold">{notice}</span>}
      </p>

      {items.length > 0 && (
        <ul className="grid grid-cols-3 gap-3">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="relative aspect-[4/3] overflow-hidden rounded-xl bg-ink/10"
            >
              <Image
                src={item.url}
                alt={`Скриншот ${index + 1}`}
                fill
                unoptimized
                sizes="160px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                aria-label={`Убрать скриншот ${index + 1}`}
                className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-ink text-lg leading-none text-paper transition-colors hover:bg-tomato"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
