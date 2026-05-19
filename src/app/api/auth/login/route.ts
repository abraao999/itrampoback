import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { createAuthToken, verifyPassword } from "@/lib/auth";
import { User } from "@/models/User";

export async function POST(request: NextRequest) {
  await connectToDatabase();

  const body = await request.json();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!email || !password) {
    return NextResponse.json(
      { message: "E-mail e senha sao obrigatorios." },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email });

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json(
      { message: "E-mail ou senha invalidos." },
      { status: 401 }
    );
  }

  const safeUser = {
    id: String(user._id),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role
  };
  const token = createAuthToken({
    sub: safeUser.id,
    name: safeUser.name,
    email: safeUser.email,
    role: safeUser.role
  });

  return NextResponse.json({ user: safeUser, token });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
