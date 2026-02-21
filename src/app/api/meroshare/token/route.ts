import { requireAuth } from "@/helper/require-auth";
import { getValidToken } from "@/server/features/functions/Token";
import { MeroShareAuthPayload } from "@/shared/types/MeroShareAuth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await requireAuth(req);
    const payload: MeroShareAuthPayload = await req.json();

    const { token, data } = await getValidToken(payload);
    if (token) {
      return NextResponse.json({
        success: true,
        status: 200,
        data: {
          token,
          data,
        },
      });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({
      success: false,
      status: 500,
      message,
    });
  }
}
