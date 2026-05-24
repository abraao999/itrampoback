import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { publicProvider } from "@/lib/providerResponse";
import { Provider } from "@/models/Provider";

export async function GET(request: NextRequest) {
  await connectToDatabase();

  const { searchParams } = new URL(request.url);
  const specialtySlug = searchParams.get("specialtySlug")?.trim().toLowerCase();
  const query = {
    status: "active",
    ...(specialtySlug ? { specialtySlug } : {})
  };

  const providers = await Provider.find(query).sort({ companyName: 1 });

  return NextResponse.json({
    providers: providers.map((provider) => publicProvider(provider))
  });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
