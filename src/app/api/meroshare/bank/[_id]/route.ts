import { requireAuth } from "@/helper/require-auth";
import { getBank } from "@/server/features/functions/bank";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ _id: string }> }
) {
  try {
    const session = await requireAuth(req);

    const { _id } = await params;

    const data = await getBank(_id, session.user.id);
    console.log(data);
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
