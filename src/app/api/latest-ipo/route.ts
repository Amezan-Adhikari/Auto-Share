import { decrypt } from "@/app/utils/encryption";
import { requireAuth } from "@/helper/require-auth";
import { getValidToken } from "@/server/features/functions/Token";
import MeroShareAccountModel from "@/server/features/mero-share-account/models/MeroShareAccount";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await requireAuth(req);
    const data = await MeroShareAccountModel.findOne({ userID: session.user.id });
    if (!data)
      return NextResponse.json({
        success: false,
        status: 404,
        message: "No accounts found",
      });

    const { token } = await getValidToken({
      clientId: data.clientId,
      password: decrypt(data.password),
      username: data.username,
    });
    console.log(token);
    const res = await fetch(
      "https://webbackend.cdsc.com.np/api/meroShare/companyShare/applicableIssue/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
          Origin: "https://meroshare.cdsc.com.np",
          Referer: "https://meroshare.cdsc.com.np/",
          "User-Agent": "Mozilla/5.0",
          Authorization: token,
          "X-Auth-Token": token,
        },
        body: JSON.stringify({
          filterDateParams: [
            { key: "minIssueOpenDate", condition: "", alias: "", value: "" },
            { key: "maxIssueCloseDate", condition: "", alias: "", value: "" },
          ],
          filterFieldParams: [
            { key: "companyIssue.companyISIN.script", alias: "Scrip" },
            {
              key: "companyIssue.companyISIN.company.name",
              alias: "Company Name",
            },
            {
              key: "companyIssue.assignedToClient.name",
              value: "",
              alias: "Issue Manager",
            },
          ],
          page: 1,
          searchRoleViewConstants: "VIEW_APPLICABLE_SHARE",
          size: 10,
        }),
      },
    );
    console.log("lol",res);

    const IPOS = await res.json();
    console.log(IPOS);
    return NextResponse.json({
      success: true,
      status: 200,
      data: IPOS.object,
    });
  } catch {
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Something went wrong",
    });
  }
}
