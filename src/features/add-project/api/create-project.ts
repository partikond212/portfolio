"use server";

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

export type CreateProjectState =
  | {
      errors?: ProjectFieldErrors;
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
    siteUrl: formData.get("siteUrl") ?? "",
  });
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  const files = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);

  const imagesError = validateNewImages(files, 0);
  if (imagesError) return { message: imagesError };

  let images: string[];
  try {
    images = await Promise.all(files.map(uploadImage));
  } catch (error) {
    console.error("createProject: загрузка картинок", error);
    return {
      message:
        "Не удалось загрузить картинки. Проверьте ключи Cloudinary и повторите.",
    };
  }

  try {
    await prisma.project.create({ data: { ...parsed.data, images } });
  } catch (error) {
    console.error("createProject: сохранение в базу", error);
    // картинки уже загружены, а проект не сохранился: убираем, чтобы не копились
    await deleteImages(images).catch((e) =>
      console.error("createProject: очистка картинок", e),
    );
    return {
      message: isUniqueViolation(error)
        ? "Проект с такой ссылкой на репозиторий уже есть. Укажи другую ссылку."
        : "Не удалось сохранить из-за ошибки на сервере. Попробуй ещё раз; причина записана в логе сервера.",
    };
  }

  return { success: true };
}
