import { decrypt, encrypt } from "@/app/utils/encryption";
import MeroShareAccountModel from "../../mero-share-account/models/MeroShareAccount";

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString()
    );

    if (!payload.exp) return false; // no expiry claim

    const now = Math.floor(Date.now() / 1000);
    return payload.exp <= now;
  } catch {
    return true;
  }
}

export async function getValidStoredToken(_id:string,userID:string){
  const data = await MeroShareAccountModel.findOne({_id,userID});
  if(!data) return;

  const token = data?.authorization;
  if(isTokenExpired(decrypt(token)) || !token){
    const {token:newToken} = await getValidToken({
        clientId: data.clientId,
        password: decrypt(data.password),
        username: data.username,
    })
    await MeroShareAccountModel.updateOne({_id,userID},{
      authorization: encrypt(newToken)
    })
    return newToken;
  }else{
    return decrypt(token);
  }
}


export async function getValidToken(payload:{
    clientId: number;
    password: string;
    username: string;
}) {
  const res = await fetch(
    "https://webbackend.cdsc.com.np/api/meroShare/auth/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://meroshare.cdsc.com.np",
        Referer: "https://meroshare.cdsc.com.np/",
        "User-Agent": "Mozilla/5.0",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    throw new Error("Invalid credentials. Check DP, username and password");
  }

  const token = res.headers.get("authorization");
  const data = await res.json();

  if (!token) {
    throw new Error("No Authorization token returned");
  }

  return { token, data };
}