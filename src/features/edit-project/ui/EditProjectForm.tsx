"use client";

import Image from "next/image";
import Link from "next/link";
import {
  startTransition,
  useActionState,
  useState,
  type SubmitEvent,
} from "react";
import ImagePicker from "@/shared/ui/image-picker/ImagePicker";
import {
  MAX_IMAGES,
  MAX_UPLOAD_BYTES,
} from "@/entities/project/model/project-schema";
import { updateProject } from "../api/update-project";

const field =
  "rounded-xl bg-paper px-4 py-3 outline-offset-2 focus-visible:outline-2 focus-visible:outline-ink";

type EditableProject = {
  id: string;
  title: string;
  description: string;
  repoLink: string;
  siteUrl: string | null;
  images: string[];
};

type EditProjectFormProps = {
  project: EditableProject;
};

export default function EditProjectForm({ project }: EditProjectFormProps) {
  const [state, action, pending] = useActionState(updateProject, undefined);
  const [kept, setKept] = useState(project.images);

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => action(formData));
  };

  return (
    <form onSubmit={onSubmit} className="flex max-w-xl flex-col gap-3">
      <input type="hidden" name="id" value={project.id} />
      {kept.map((url) => (
        <input key={url} type="hidden" name="keep" value={url} />
      ))}

      <label htmlFor="title">Название</label>
      <input
        id="title"
        name="title"
        defaultValue={project.title}
        className={field}
      />
      {state?.errors?.title && <p>{state.errors.title[0]}</p>}

      <label htmlFor="description">Описание</label>
      <textarea
        id="description"
        name="description"
        rows={4}
        defaultValue={project.description}
        className={field}
      />
      {state?.errors?.description && <p>{state.errors.description[0]}</p>}

      <label htmlFor="siteUrl">Ссылка на сайт проекта (необязательно)</label>
      <input
        id="siteUrl"
        name="siteUrl"
        type="url"
        defaultValue={project.siteUrl ?? ""}
        placeholder="https://мой-проект.vercel.app"
        className={field}
      />
      {state?.errors?.siteUrl && <p>{state.errors.siteUrl[0]}</p>}

      <label htmlFor="repoLink">Ссылка на репозиторий</label>
      <input
        id="repoLink"
        name="repoLink"
        type="url"
        defaultValue={project.repoLink}
        className={field}
      />
      {state?.errors?.repoLink && <p>{state.errors.repoLink[0]}</p>}

      <div className="flex flex-col gap-3">
        <p>
          Текущие картинки ({kept.length} из {MAX_IMAGES})
        </p>
        {kept.length === 0 ? (
          <p className="text-sm">Картинок нет. Добавь новые ниже.</p>
        ) : (
          <ul className="grid grid-cols-3 gap-3">
            {kept.map((url, index) => (
              <li
                key={url}
                className="relative aspect-4/3 overflow-hidden rounded-xl bg-ink/10"
              >
                <Image
                  src={url}
                  alt={`Текущий скриншот ${index + 1}`}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setKept((prev) => prev.filter((item) => item !== url))
                  }
                  aria-label={`Убрать скриншот ${index + 1}`}
                  className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-ink text-lg leading-none text-paper transition-colors hover:bg-tomato"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="text-sm">
          Убранные картинки удалятся окончательно после сохранения.
        </p>
      </div>

      <ImagePicker
        name="images"
        label="Добавить новые скриншоты"
        maxFiles={Math.max(0, MAX_IMAGES - kept.length)}
        maxTotalBytes={MAX_UPLOAD_BYTES}
      />

      {state?.message && <p role="alert">{state.message}</p>}

      <div className="mt-2 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-ink px-6 py-3 text-paper transition-colors hover:bg-tomato disabled:opacity-60"
        >
          {pending ? "Сохраняю…" : "Сохранить изменения"}
        </button>
        <Link
          href="/admin"
          className="font-semibold underline decoration-2 underline-offset-4"
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}
