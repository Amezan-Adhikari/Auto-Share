import toObjectId from "@/app/utils/to-object-id";
import { requireAuth } from "@/helper/require-auth";
import MeroShareAccountBankModel from "@/server/features/bank/models/MeroShareAccountBank";
import MeroShareBankModel from "@/server/features/bank/models/MeroShareBank";
import { getBank } from "@/server/features/functions/bank";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ _id: string }> }
) {
  try {
    const session = await requireAuth(req);
    const { _id } = await params;
    const accountObjectId = toObjectId(_id);

    const [bankData] = await getBank(_id, session.user.id);
    if (!bankData.id) {
      return NextResponse.json({ success: false, message: "No bank found" }, { status: 404 });
    }

    let bankDoc = await MeroShareBankModel.findOne({ id: bankData.id });
    if (!bankDoc) {
      bankDoc = await MeroShareBankModel.create({
        code: bankData.code,
        id: bankData.id,
        name: bankData.name,
      });
    }

    await MeroShareAccountBankModel.findOneAndUpdate(
      { meroShareAccountId: accountObjectId, bankId: bankDoc._id },
      { $setOnInsert: { meroShareAccountId: accountObjectId, bankId: bankDoc._id } },
      { upsert: true, returnDocument: "after" }
    );

    return NextResponse.json({ success: true, data: bankData });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
