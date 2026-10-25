import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/shared/lib/session";

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get("session")?.value;
  const session = await decrypt(token);

  const isLogin = path === "/admin/login";

  if (!isLogin && !session?.adminId) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }
  if (isLogin && session?.adminId) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
