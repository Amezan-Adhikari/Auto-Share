import crypto from "crypto";

const algorithm = "aes-256-gcm";
const key = Buffer.from(process.env.SECRET_KEY!, "hex");

export function encrypt(text: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return {
    content: encrypted.toString("hex"),
    iv: iv.toString("hex"),
    tag: tag.toString("hex"),
  };
}

export function decrypt(payload: any) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(payload.iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(payload.tag, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payload.content, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}