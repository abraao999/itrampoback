import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "itrampo-backend"
  });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
