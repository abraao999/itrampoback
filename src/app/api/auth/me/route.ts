import { NextRequest, NextResponse } from "next/server";
import { getBearerToken, verifyAuthToken } from "@/lib/auth";

export function GET(request: NextRequest) {
  const token = getBearerToken(request.headers.get("authorization"));
  const payload = token ? verifyAuthToken(token) : null;

  if (!payload) {
    return NextResponse.json({ message: "Token invalido." }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role
    }
  });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
