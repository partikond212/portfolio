import * as z from "zod";

export const MAX_IMAGES = 6;
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

// Только http(s): ссылки вида javascript:... в href нам не нужны
const isHttpUrl = (value: string) =>
  /^https?:\/\//i.test(value) && URL.canParse(value);

export const ProjectSchema = z.object({
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
  repoLink: z.string().trim().refine(isHttpUrl, {
    error:
      "Введите ссылку на репозиторий, например https://github.com/ник/репозиторий",
  }),
  siteUrl: z
    .string()
    .trim()
    .refine((value) => value === "" || isHttpUrl(value), {
      error: "Ссылка на сайт должна начинаться с https://",
    })
    .transform((value) => (value === "" ? null : value)),
});

export type ProjectFieldErrors = {
  title?: string[];
  description?: string[];
  repoLink?: string[];
  siteUrl?: string[];
};

// Проверка новых картинок; keptCount: сколько старых картинок остаётся у проекта.
// Возвращает текст ошибки или null, если всё в порядке.
export function validateNewImages(
  files: File[],
  keptCount: number,
): string | null {
  if (keptCount + files.length > MAX_IMAGES) {
    return `У проекта может быть не больше ${MAX_IMAGES} картинок`;
  }
  const total = files.reduce((sum, file) => sum + file.size, 0);
  if (total > MAX_UPLOAD_BYTES) {
    return "Суммарный размер новых картинок больше 4 МБ — сожмите их или загрузите меньше";
  }
  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      return `«${file.name}» — не картинка`;
    }
  }
  return null;
}
