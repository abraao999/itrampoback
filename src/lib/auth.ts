import crypto from "crypto";

const tokenSecret = process.env.AUTH_SECRET ?? "itrampo-dev-secret";

type TokenPayload = {
  sub: string;
  name: string;
  email: string;
  role: string;
  exp: number;
};

function base64Url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function parseBase64Url(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64").toString("utf8");
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");

  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedPassword: string) {
  const [salt, storedHash] = storedPassword.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const hash = crypto.scryptSync(password, salt, 64);
  const storedHashBuffer = Buffer.from(storedHash, "hex");

  return (
    storedHashBuffer.length === hash.length &&
    crypto.timingSafeEqual(storedHashBuffer, hash)
  );
}

export function createAuthToken(payload: Omit<TokenPayload, "exp">) {
  const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64Url(
    JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
    })
  );
  const signature = base64Url(
    crypto.createHmac("sha256", tokenSecret).update(`${header}.${body}`).digest()
  );

  return `${header}.${body}.${signature}`;
}

export function verifyAuthToken(token: string) {
  const [header, body, signature] = token.split(".");

  if (!header || !body || !signature) {
    return null;
  }

  const expectedSignature = base64Url(
    crypto.createHmac("sha256", tokenSecret).update(`${header}.${body}`).digest()
  );

  if (signature !== expectedSignature) {
    return null;
  }

  const payload = JSON.parse(parseBase64Url(body)) as TokenPayload;

  if (payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}

export function getBearerToken(authorizationHeader: string | null) {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.replace("Bearer ", "").trim();
}
