"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  type SubmitEvent,
} from "react";
import { createProject } from "../api/create-project";
import ImagePicker from "@/shared/ui/image-picker/ImagePicker";
import {
  MAX_IMAGES,
  MAX_UPLOAD_BYTES,
} from "@/entities/project/model/project-schema";

const field =
  "rounded-xl bg-paper px-4 py-3 outline-offset-2 focus-visible:outline-2 focus-visible:outline-ink";

export default function AddProjectForm() {
  const [state, action, pending] = useActionState(createProject, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  // Отправляем вручную, а не через <form action>: React 19 после такого action
  // сбрасывает все поля, даже если пришла ошибка, и введённое пропадало бы
  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => action(formData));
  };

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="mt-8 flex max-w-xl flex-col gap-3"
    >
      <label htmlFor="title">Название</label>
      <input id="title" name="title" className={field} />
      {state?.errors?.title && <p>{state.errors.title[0]}</p>}

      <label htmlFor="description">Описание</label>
      <textarea
        id="description"
        name="description"
        rows={4}
        className={field}
      />
      {state?.errors?.description && <p>{state.errors.description[0]}</p>}

      <ImagePicker
        name="images"
        maxFiles={MAX_IMAGES}
        maxTotalBytes={MAX_UPLOAD_BYTES}
      />

      <label htmlFor="siteUrl">
        Ссылка на сайт проекта (необязательно)
      </label>
      <input
        id="siteUrl"
        name="siteUrl"
        type="url"
        placeholder="https://мой-проект.vercel.app"
        className={field}
      />
      {state?.errors?.siteUrl && <p>{state.errors.siteUrl[0]}</p>}

      <label htmlFor="repoLink">Ссылка на репозиторий</label>
      <input
        id="repoLink"
        name="repoLink"
        type="url"
        placeholder="https://github.com/ник/репозиторий"
        className={field}
      />
      {state?.errors?.repoLink && <p>{state.errors.repoLink[0]}</p>}

      {state?.message && <p role="alert">{state.message}</p>}
      {state?.success && <p role="status">Проект добавлен</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-full bg-ink px-6 py-3 text-paper transition-colors hover:bg-tomato disabled:opacity-60"
      >
        {pending ? "Сохраняю…" : "Добавить проект"}
      </button>
    </form>
  );
}
