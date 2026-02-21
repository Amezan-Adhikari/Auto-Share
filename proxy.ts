
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./src/app/lib/auth";

export async function proxy(req: NextRequest) {
  const session = await auth.api.getSession({
    request: req,
    headers:req.headers
  });

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
