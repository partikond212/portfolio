"use client";

import { useActionState } from "react";
import { login } from "../api/login";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="mx-auto flex max-w-md flex-col gap-4 p-8">
      <h1 className="font-display text-2xl font-semibold">Вход</h1>

      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="username"
        className="rounded-xl bg-paper px-4 py-3"
      />
      {state?.errors?.email && <p>{state.errors.email[0]}</p>}

      <label htmlFor="password">Пароль</label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        className="rounded-xl bg-paper px-4 py-3"
      />
      {state?.errors?.password && <p>{state.errors.password[0]}</p>}

      {state?.message && <p>{state.message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ink px-6 py-3 text-paper"
      >
        {pending ? "Вхожу…" : "Войти"}
      </button>
    </form>
  );
}
