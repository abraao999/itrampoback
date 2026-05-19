import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Appointment } from "@/models/Appointment";

export async function GET() {
  await connectToDatabase();

  const appointments = await Appointment.find().sort({ createdAt: -1 }).lean();

  return NextResponse.json({ appointments });
}

export async function POST(request: NextRequest) {
  await connectToDatabase();

  const body = await request.json();
  const requiredFields = ["service", "company", "date", "time"];
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
    customerName: body.customerName,
    customerPhone: body.customerPhone,
    date: body.date,
    time: body.time
  });

  return NextResponse.json({ appointment }, { status: 201 });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
