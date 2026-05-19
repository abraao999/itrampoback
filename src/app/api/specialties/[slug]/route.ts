import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Specialty } from "@/models/Specialty";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  await connectToDatabase();

  const { slug } = await context.params;
  const specialty = await Specialty.findOne({ slug, active: true }).lean();

  if (!specialty) {
    return NextResponse.json(
      { message: "Especialidade nao encontrada." },
      { status: 404 }
    );
  }

  return NextResponse.json({ specialty });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
