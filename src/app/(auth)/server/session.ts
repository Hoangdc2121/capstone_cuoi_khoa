import "server-only";
import { errors, jwtVerify, SignJWT } from "jose";

export const SESSION_COOKIE_NAME = "o_dau_session";
export const SESSION_MAX_AGE = 60 * 60 * 24;

const SESSION_ISSUER = "o-dau";
const SESSION_AUDIENCE = "o-dau-web";

// lấy khóa bí mật từ sv
function getSessionKey() {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET phải được cấu hình và có ít nhất 32 ký tự.",
    );
  }

  return new TextEncoder().encode(secret);
}

// chỉ gọi khi be xác nhận đăng nhập thành công
export async function createSessionToken(
  userId: number,
  expiresAt: Date,
): Promise<string> {
  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw new Error("ID người dùng không hợp lệ.");
  }

  const now = Math.floor(Date.now() / 1000);

  //   phiên đăng nhập không kéo dài quá 24h hoặc tg truyền vào

  const expiration = Math.min(
    Math.floor(expiresAt.getTime() / 1000),
    now + SESSION_MAX_AGE,
  );

  if (!Number.isFinite(expiration) || expiration <= now) {
    throw new Error("Thời hạn phiên không hợp lệ.");
  }

  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setExpirationTime(expiration)
    .sign(getSessionKey());
}

// kiểm tra chữ ký, thời hạn và dữ liệu trong phiên

export async function verifySessionToken(
  token: string | undefined,
): Promise<{ userId: number; expiresAt: number } | null> {
  if (!token) return null;

  const key = getSessionKey();

  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
      requiredClaims: ["iat", "exp"],
    });

    if (
      typeof payload.userId !== "number" ||
      !Number.isSafeInteger(payload.userId) ||
      payload.userId <= 0 ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      expiresAt: payload.exp,
    };
  } catch (error) {
    // Token sai định dạng, sai chữ ký hoặc hết hạn.
    if (error instanceof errors.JOSEError) {
      return null;
    }

    throw error;
  }
}
