const COOKIE_NAME = "jimuassi_session";
const encoder = new TextEncoder();

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

function toBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(companyId: string): Promise<string> {
  const secret = process.env.DASHBOARD_SESSION_SECRET ?? "";
  const key = await getKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(companyId));
  return toBase64Url(signature);
}

export async function createSessionCookieValue(companyId: string): Promise<string> {
  return `${companyId}.${await sign(companyId)}`;
}

export async function verifySessionCookieValue(value: string | undefined): Promise<string | null> {
  if (!value) return null;
  const [companyId, signature] = value.split(".");
  if (!companyId || !signature) return null;

  const expected = await sign(companyId);
  if (signature.length !== expected.length) return null;

  let diff = 0;
  for (let i = 0; i < signature.length; i++) {
    diff |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0 ? companyId : null;
}

export { COOKIE_NAME };
