import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Specialty } from "@/models/Specialty";

const defaultSpecialties = [
  {
    name: "Encanador",
    slug: "encanador",
    icon: "wrench",
    color: "#2563eb",
    order: 1
  },
  {
    name: "Pintor",
    slug: "pintor",
    icon: "paint-roller",
    color: "#dc2626",
    order: 2
  },
  {
    name: "Eletricista",
    slug: "eletricista",
    icon: "bolt",
    color: "#f59e0b",
    order: 3
  },
  {
    name: "Pedreiro",
    slug: "pedreiro",
    icon: "hammer",
    color: "#92400e",
    order: 4
  },
  {
    name: "Diarista",
    slug: "diarista",
    icon: "broom",
    color: "#6d28d9",
    order: 5
  },
  {
    name: "Jardineiro",
    slug: "jardineiro",
    icon: "leaf",
    color: "#f97316",
    order: 6
  }
];

async function seedSpecialties() {
  await Promise.all(
    defaultSpecialties.map((specialty) =>
      Specialty.updateOne(
        { slug: specialty.slug },
        { $setOnInsert: specialty },
        { upsert: true }
      )
    )
  );
}

export async function GET() {
  await connectToDatabase();
  await seedSpecialties();

  const specialties = await Specialty.find({ active: true })
    .sort({ order: 1, name: 1 })
    .lean();

  return NextResponse.json({ specialties });
}

export async function POST(request: NextRequest) {
  await connectToDatabase();

  const body = await request.json();
  const specialty = await Specialty.create(body);

  return NextResponse.json({ specialty }, { status: 201 });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
