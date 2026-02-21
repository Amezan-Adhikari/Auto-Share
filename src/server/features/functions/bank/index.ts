import { getValidStoredToken } from "../Token";

export async function getBank(_id: string, userID: string) {

  const token = await getValidStoredToken({_id, userID});
  if (!token) return;
  const res = await fetch(
    "https://webbackend.cdsc.com.np/api/meroShare/bank/",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9,ne;q=0.8",
        Origin: "https://meroshare.cdsc.com.np",
        Referer: "https://meroshare.cdsc.com.np/",
      },
    },
  );
  const data = await res.json();
  return data;
}
