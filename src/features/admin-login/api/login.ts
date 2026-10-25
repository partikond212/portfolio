"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import * as z from "zod";
import { prisma } from "@/shared/lib/prisma";
import { createSession, deleteSession } from "@/shared/lib/session";

const LoginSchema = z.object({
  email: z.email({ error: "Введите корректный email" }).trim(),
  password: z.string().min(1, { error: "Введите пароль" }),
});

export type LoginState =
  | { errors?: { email?: string[]; password?: string[] }; message?: string }
  | undefined;

export async function login(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;
  const admin = await prisma.admin.findUnique({ where: { email } });
  const isValid = admin ? await bcrypt.compare(password, admin.password) : false;

  if (!admin || !isValid) {
    return { message: "Неверный email или пароль" };
  }

  await createSession(admin.id);
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}
