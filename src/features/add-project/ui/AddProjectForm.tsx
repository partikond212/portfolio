"use client";

import { useActionState } from "react";
import { createProject } from "../api/create-project";
const field =
  "rounded-xl bg-paper px-4 py-3 outline-offset-2 focus-visible:outline-2 focus-visible:outline-ink";
const fileField =
  "cursor-pointer text-sm file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-ink file:px-5 file:py-2 file:text-sm file:font-semibold file:text-paper file:transition-colors hover:file:bg-tomato";

export default function AddProjectForm() {
  const [state, action, pending] = useActionState(createProject, undefined);

  return (
    <form action={action} className="mt-8 flex max-w-xl flex-col gap-3">
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

      <label htmlFor="images">Скриншоты (до 6, суммарно до 4 МБ)</label>
      <input
        className={`${field} ${fileField}`}
        id="images"
        name="images"
        type="file"
        accept="image/*"
        multiple
      />

      <label htmlFor="repoLink">Ссылка на репозиторий</label>
      <input id="repoLink" name="repoLink" type="url" className={field} />
      {state?.errors?.repoLink && <p>{state.errors.repoLink[0]}</p>}

      {state?.message && <p>{state.message}</p>}
      {state?.success && <p>Проект добавлен</p>}

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
