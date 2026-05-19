import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { createAuthToken, hashPassword } from "@/lib/auth";
import { User } from "@/models/User";

function publicUser(user: {
  _id: unknown;
  name: string;
  email: string;
  phone?: string;
  role: string;
}) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role
  };
}

export async function POST(request: NextRequest) {
  await connectToDatabase();

  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const phone = String(body.phone ?? "").trim();

  if (!name || !email || !password) {
    return NextResponse.json(
      { message: "Nome, e-mail e senha sao obrigatorios." },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { message: "A senha precisa ter pelo menos 6 caracteres." },
      { status: 400 }
    );
  }

  const existingUser = await User.findOne({ email }).lean();

  if (existingUser) {
    return NextResponse.json(
      { message: "Ja existe uma conta com esse e-mail." },
      { status: 409 }
    );
  }

  const user = await User.create({
    name,
    email,
    phone,
    passwordHash: hashPassword(password)
  });
  const safeUser = publicUser(user);
  const token = createAuthToken({
    sub: safeUser.id,
    name: safeUser.name,
    email: safeUser.email,
    role: safeUser.role
  });

  return NextResponse.json({ user: safeUser, token }, { status: 201 });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
