import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "./session";

export const verifySession = cache(async () => {
  const token = (await cookies()).get("session")?.value;
  const session = await decrypt(token);
  if (!session?.adminId) redirect("/admin/login");
  return { adminId: session.adminId };
});
