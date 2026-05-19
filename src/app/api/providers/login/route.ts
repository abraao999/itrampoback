import { NextRequest, NextResponse } from "next/server";
import { createAuthToken, verifyPassword } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { publicProvider } from "@/lib/providerResponse";
import { Provider } from "@/models/Provider";

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

  const provider = await Provider.findOne({ email });

  if (!provider || !verifyPassword(password, provider.passwordHash)) {
    return NextResponse.json(
      { message: "E-mail ou senha invalidos." },
      { status: 401 }
    );
  }

  if (provider.status === "blocked") {
    return NextResponse.json(
      { message: "Cadastro bloqueado. Entre em contato com o suporte." },
      { status: 403 }
    );
  }

  const safeProvider = publicProvider(provider);
  const token = createAuthToken({
    sub: safeProvider.id,
    name: safeProvider.name,
    email: safeProvider.email,
    role: "provider"
  });

  return NextResponse.json({ provider: safeProvider, token });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
