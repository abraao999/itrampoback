import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Appointment } from "@/models/Appointment";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  await connectToDatabase();

  const { id } = await context.params;
  const body = await request.json();
  const allowedFields = [
    "status",
    "quotePrice",
    "proposedDate",
    "proposedTime",
    "quoteMessage"
  ];
  const update = Object.fromEntries(
    Object.entries(body).filter(([key]) => allowedFields.includes(key))
  );

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { message: "Nenhum campo valido para atualizar." },
      { status: 400 }
    );
  }

  const appointment = await Appointment.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true
  });

  if (!appointment) {
    return NextResponse.json(
      { message: "Solicitacao nao encontrada." },
      { status: 404 }
    );
  }

  return NextResponse.json({ appointment });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
