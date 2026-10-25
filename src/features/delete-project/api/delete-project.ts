"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/shared/lib/prisma";
import { verifySession } from "@/shared/lib/dal";
import { deleteImages } from "@/shared/lib/cloudinary";

export type DeleteProjectState = { message?: string } | undefined;

export async function deleteProject(
  _state: DeleteProjectState,
  formData: FormData,
): Promise<DeleteProjectState> {
  await verifySession();

  const id = formData.get("id");
  if (typeof id !== "string" || id.length === 0) {
    return { message: "Не удалось определить проект" };
  }

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    revalidatePath("/admin");
    return { message: "Проект уже удалён" };
  }

  try {
    await prisma.project.delete({ where: { id } });
  } catch (error) {
    console.error("deleteProject: удаление из базы", error);
    return { message: "Не удалось удалить проект. Попробуй ещё раз." };
  }

  try {
    await deleteImages(project.images);
  } catch (error) {
    // проект уже удалён из базы; лишние картинки можно стереть в кабинете Cloudinary
    console.error("deleteProject: удаление картинок из Cloudinary", error);
  }

  revalidatePath("/admin");
  revalidatePath("/");
  return undefined;
}
