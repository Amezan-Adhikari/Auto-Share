import { auth } from "@/app/lib/auth";

export async function requireAuth(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}