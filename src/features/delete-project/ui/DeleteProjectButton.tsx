"use client";

import { useActionState, useState } from "react";
import { deleteProject } from "../api/delete-project";

type DeleteProjectButtonProps = {
  id: string;
  title: string;
};

export default function DeleteProjectButton({
  id,
  title,
}: DeleteProjectButtonProps) {
  const [state, action, pending] = useActionState(deleteProject, undefined);
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label={`Удалить проект «${title}»`}
        className="rounded-full border-2 border-ink px-4 py-1.5 text-sm font-semibold transition-colors hover:bg-ink hover:text-paper"
      >
        Удалить
      </button>
    );
  }

  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <span className="text-sm font-semibold">Удалить насовсем?</span>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-tomato px-4 py-1.5 text-sm font-semibold text-paper transition-colors hover:bg-ink disabled:opacity-60"
      >
        {pending ? "Удаляю…" : "Да, удалить"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        disabled={pending}
        className="rounded-full border-2 border-ink px-4 py-1.5 text-sm font-semibold disabled:opacity-60"
      >
        Отмена
      </button>
      {state?.message && (
        <p role="alert" className="w-full text-sm">
          {state.message}
        </p>
      )}
    </form>
  );
}
