"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";
import { prisma } from "@/shared/lib/prisma";
import { verifySession } from "@/shared/lib/dal";
import { deleteImages, uploadImage } from "@/shared/lib/cloudinary";
import { isUniqueViolation } from "@/shared/lib/prisma-errors";
import {
  ProjectSchema,
  validateNewImages,
  type ProjectFieldErrors,
} from "@/entities/project/model/project-schema";

export type UpdateProjectState =
  | { errors?: ProjectFieldErrors; message?: string }
  | undefined;

export async function updateProject(
  _state: UpdateProjectState,
  formData: FormData,
): Promise<UpdateProjectState> {
  await verifySession();

  const id = formData.get("id");
  if (typeof id !== "string" || id.length === 0) {
    return { message: "Не удалось определить проект" };
  }

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    return { message: "Проект не найден: возможно, его уже удалили" };
  }

  const parsed = ProjectSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    repoLink: formData.get("repoLink"),
    siteUrl: formData.get("siteUrl") ?? "",
  });
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  // Форме не доверяем: оставляем только те старые картинки, которые есть у проекта
  const keep = formData
    .getAll("keep")
    .filter(
      (value): value is string =>
        typeof value === "string" && project.images.includes(value),
    );

  const files = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);

  const imagesError = validateNewImages(files, keep.length);
  if (imagesError) return { message: imagesError };

  let uploaded: string[];
  try {
    uploaded = await Promise.all(files.map(uploadImage));
  } catch (error) {
    console.error("updateProject: загрузка картинок", error);
    return {
      message:
        "Не удалось загрузить картинки. Проверьте ключи Cloudinary и повторите.",
    };
  }

  try {
    await prisma.project.update({
      where: { id },
      data: { ...parsed.data, images: [...keep, ...uploaded] },
    });
  } catch (error) {
    console.error("updateProject: сохранение в базу", error);
    // новые картинки уже загружены, а проект не обновился: убираем их, чтобы не копились
    await deleteImages(uploaded).catch((e) =>
      console.error("updateProject: очистка новых картинок", e),
    );
    return {
      message: isUniqueViolation(error)
        ? "Проект с такой ссылкой на репозиторий уже есть. Укажи другую ссылку."
        : "Не удалось сохранить из-за ошибки на сервере. Попробуй ещё раз; причина записана в логе сервера.",
    };
  }

  const removed = project.images.filter((url) => !keep.includes(url));
  await deleteImages(removed).catch((e) =>
    console.error("updateProject: удаление старых картинок", e),
  );

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}
