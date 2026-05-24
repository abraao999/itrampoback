import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Appointment } from "@/models/Appointment";

export async function GET(request: NextRequest) {
  await connectToDatabase();

  const { searchParams } = new URL(request.url);
  const providerId = searchParams.get("providerId")?.trim();
  const customerEmail = searchParams.get("customerEmail")?.trim().toLowerCase();
  const query = {
    ...(providerId ? { providerId } : {}),
    ...(customerEmail ? { customerEmail } : {})
  };
  const appointments = await Appointment.find(query)
    .sort({ date: 1, time: 1, createdAt: -1 })
    .lean();

  return NextResponse.json({ appointments });
}

export async function POST(request: NextRequest) {
  await connectToDatabase();

  const body = await request.json();
  const requiredFields = ["service", "company", "providerId", "providerName", "providerPhone", "date", "time"];
  const missingFields = requiredFields.filter((field) => !body[field]);

  if (missingFields.length > 0) {
    return NextResponse.json(
      {
        message: "Campos obrigatórios ausentes.",
        fields: missingFields
      },
      { status: 400 }
    );
  }

  const appointment = await Appointment.create({
    service: body.service,
    company: body.company,
    providerId: body.providerId,
    providerName: body.providerName,
    providerPhone: body.providerPhone,
    customerName: body.customerName,
    customerPhone: body.customerPhone,
    customerEmail: body.customerEmail,
    date: body.date,
    time: body.time
  });

  return NextResponse.json({ appointment }, { status: 201 });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
