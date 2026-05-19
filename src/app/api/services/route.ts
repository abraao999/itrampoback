import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Service } from "@/models/Service";

const defaultServices = [
  { name: "Encanador", slug: "encanador" },
  { name: "Pintor", slug: "pintor" },
  { name: "Eletricista", slug: "eletricista" },
  { name: "Pedreiro", slug: "pedreiro" },
  { name: "Diarista", slug: "diarista" },
  { name: "Jardineiro", slug: "jardineiro" }
];

export async function GET() {
  await connectToDatabase();

  const count = await Service.countDocuments();

  if (count === 0) {
    await Service.insertMany(defaultServices);
  }

  const services = await Service.find().sort({ name: 1 }).lean();

  return NextResponse.json({ services });
}

export async function POST(request: NextRequest) {
  await connectToDatabase();

  const body = await request.json();
  const service = await Service.create(body);

  return NextResponse.json({ service }, { status: 201 });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
