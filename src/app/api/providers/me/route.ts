import { NextRequest, NextResponse } from "next/server";
import { getBearerToken, verifyAuthToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { publicProvider } from "@/lib/providerResponse";
import { Provider } from "@/models/Provider";

export async function GET(request: NextRequest) {
  const token = getBearerToken(request.headers.get("authorization"));
  const payload = token ? verifyAuthToken(token) : null;

  if (!payload || payload.role !== "provider") {
    return NextResponse.json({ message: "Token invalido." }, { status: 401 });
  }

  await connectToDatabase();

  const provider = await Provider.findById(payload.sub);

  if (!provider) {
    return NextResponse.json(
      { message: "Prestador nao encontrado." },
      { status: 404 }
    );
  }

  return NextResponse.json({ provider: publicProvider(provider) });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
