import { NextRequest, NextResponse } from "next/server";
import { createAuthToken, hashPassword } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { publicProvider } from "@/lib/providerResponse";
import { Provider } from "@/models/Provider";
import { Specialty } from "@/models/Specialty";

type ProviderSpecialty = {
  slug: string;
  name: string;
};

export async function POST(request: NextRequest) {
  await connectToDatabase();

  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const phone = String(body.phone ?? "").trim();
  const companyName = String(body.companyName ?? "").trim();
  const specialtySlug = String(body.specialtySlug ?? "").trim().toLowerCase();
  const city = String(body.city ?? "").trim();

  if (!name || !email || !password || !phone || !companyName || !specialtySlug) {
    return NextResponse.json(
      { message: "Preencha nome, e-mail, senha, telefone, empresa e especialidade." },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { message: "A senha precisa ter pelo menos 6 caracteres." },
      { status: 400 }
    );
  }

  const existingProvider = await Provider.findOne({ email }).lean();

  if (existingProvider) {
    return NextResponse.json(
      { message: "Ja existe um prestador com esse e-mail." },
      { status: 409 }
    );
  }

  const specialty = await Specialty.findOne<ProviderSpecialty>({
    slug: specialtySlug,
    active: true
  }).lean();

  if (!specialty) {
    return NextResponse.json(
      { message: "Especialidade nao encontrada." },
      { status: 404 }
    );
  }

  const provider = await Provider.create({
    name,
    email,
    phone,
    companyName,
    specialtySlug: specialty.slug,
    specialtyName: specialty.name,
    city,
    passwordHash: hashPassword(password)
  });
  const safeProvider = publicProvider(provider);
  const token = createAuthToken({
    sub: safeProvider.id,
    name: safeProvider.name,
    email: safeProvider.email,
    role: "provider"
  });

  return NextResponse.json({ provider: safeProvider, token }, { status: 201 });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
