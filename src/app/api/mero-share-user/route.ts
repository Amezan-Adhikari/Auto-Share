import { encrypt } from "@/app/utils/encryption";
import { requireAuth } from "@/helper/require-auth";
import { getValidToken } from "@/server/features/functions/Token";
import MeroShareAccountModel from "@/server/features/mero-share-account/models/MeroShareAccount";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await requireAuth(req);
    const data = await MeroShareAccountModel.find({ userID: session.user.id });
    return NextResponse.json({
      success: true,
      status: 200,
      data,
    });
  } catch {
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Something went wrong",
    });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuth(req);
    const body = await req.json();
    const {token} = await getValidToken(body);
    if (!token){
      throw new Error("Invalid credentials. Check your DP, username and password");
    }
    if(await MeroShareAccountModel.findOne({username:body.username,userID:session.user.id})){
        return NextResponse.json({
            success: false,
            status: 409,
            message: "Account already exists",
        });
    }
    const {_id} = await MeroShareAccountModel.create({
      userID: session.user.id,
      password: encrypt(body.password),
      authorization: encrypt(token),
      username: body.username,
      clientId: body.clientId,
    });
    return NextResponse.json({
      success: true,
      _id,
      message: "Created",
      status: 200,
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      err,
      status: 500,
      message: "something went wrong",
    });
  }
}
// const { token } = await getValidToken();
// const res = await fetch(
//   "https://webbackend.cdsc.com.np/api/meroShare/bank/",
//   {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json, text/plain, */*",
//       Origin: "https://meroshare.cdsc.com.np",
//       Referer: "https://meroshare.cdsc.com.np/",
//       "User-Agent": "Mozilla/5.0",
//       Authorization: token,
//     },
//   },
// );
//     const body: UserType = await req.json();
//     await connectDB();
//     await MeroShareAccount.create({
//       userID: session.user.id,
//       password: encrypt(body.password),
//       username: body.name,
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Created",
//       status: 200,
//     });
//   } catch {
//     return NextResponse.json({
//       success: false,
//       satus: 500,
//       message: "Something went wrong",
//     });
//   }
// }
