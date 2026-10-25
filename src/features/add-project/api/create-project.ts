"use server";

import * as z from "zod";
import { prisma } from "@/shared/lib/prisma";
import { verifySession } from "@/shared/lib/dal";
import { uploadImage } from "@/shared/lib/cloudinary";

const ProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, { error: "Название — минимум 2 символа" })
    .max(80, { error: "Название — максимум 80 символов" }),
  description: z
    .string()
    .trim()
    .min(10, { error: "Описание — минимум 10 символов" })
    .max(600, { error: "Описание — максимум 600 символов" }),
  repoLink: z.url({ error: "Введите ссылку, например https://github.com/ник/репозиторий" }),
});

export type CreateProjectState =
  | {
      errors?: { title?: string[]; description?: string[]; repoLink?: string[] };
      message?: string;
      success?: boolean;
    }
  | undefined;

export async function createProject(
  _state: CreateProjectState,
  formData: FormData,
): Promise<CreateProjectState> {
  await verifySession();

  const parsed = ProjectSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    repoLink: formData.get("repoLink"),
  });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }
const files = formData
  .getAll("images")
  .filter((f): f is File => f instanceof File && f.size > 0);

if (files.length > 6) {
  return { message: "Можно загрузить не больше 6 картинок" };
}
const total = files.reduce((sum, f) => sum + f.size, 0);
if (total > 4 * 1024 * 1024) {
  return { message: "Суммарный размер картинок больше 4 МБ — сожмите их или загрузите меньше" };
}
for (const f of files) {
  if (!f.type.startsWith("image/")) {
    return { message: `«${f.name}» — не картинка` };
  }
}

let images: string[];
try {
  images = await Promise.all(files.map(uploadImage));
} catch {
  return { message: "Не удалось загрузить картинки. Проверьте ключи Cloudinary и повторите." };
}

  try {
    await prisma.project.create({ data: { ...parsed.data, images:images } });
  } catch {
    return {
      message: "Не удалось сохранить. Возможно, проект с такой ссылкой на репозиторий уже есть.",
    };
  }

  return { success: true };
}
