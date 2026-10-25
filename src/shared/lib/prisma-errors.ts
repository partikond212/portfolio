// P2002: нарушено ограничение уникальности (например, такой repoLink уже есть у другого проекта)
export function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}
