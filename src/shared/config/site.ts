// Адрес сайта для метатегов, sitemap и JSON-LD.
// Порядок: свой домен из NEXT_PUBLIC_SITE_URL → адрес проекта на Vercel (Vercel
// подставляет его сам) → localhost для разработки. Пустые и некорректные значения
// пропускаем: из-за них new URL() в layout валил бы всю сборку.
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit && URL.canParse(explicit)) return explicit.replace(/\/$/, "");

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelHost) return `https://${vercelHost}`;

  return "http://localhost:3000";
}

export const siteConfig = {
  url: resolveSiteUrl(),
  name: "Part1k0nd",
  title: "Part1k0nd — сайты и интернет-магазины под ключ",
  description:
    "Делаю сайты и интернет-магазины на TypeScript и React: от идеи до запуска. Расскажите, что продаёте, и я подберу решение под вашу задачу.",
  locale: "ru_RU",
  social: {
    github: "https://github.com/partikond212",
    telegram: "https://t.me/Partik0nddd",
  },
};
