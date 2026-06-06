import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const queryCompanyId = searchParams.get("companyId");

  const companyId = session?.user?.companyId || queryCompanyId;

  if (!companyId) {
    return NextResponse.json({ error: "Unauthorized or missing companyId" }, { status: 401 });
  }

  try {
    const appointment = await prisma.appointment.findUnique({
      where: {
        id,
        companyId,
      },
      include: {
        customer: true,
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Failed to fetch appointment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await params;

  try {
    const body = await req.json();
    const { scheduledAt, status, companyId: bodyCompanyId } = body;

    const companyId = session?.user?.companyId || bodyCompanyId;

    if (!companyId) {
      return NextResponse.json({ error: "Unauthorized or missing companyId" }, { status: 401 });
    }

    const appointment = await prisma.appointment.update({
      where: {
        id,
        companyId,
      },
      data: {
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
        status,
      },
      include: {
        customer: true,
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Failed to update appointment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const queryCompanyId = searchParams.get("companyId");

  const companyId = session?.user?.companyId || queryCompanyId;

  if (!companyId) {
    return NextResponse.json({ error: "Unauthorized or missing companyId" }, { status: 401 });
  }

  try {
    await prisma.appointment.delete({
      where: {
        id,
        companyId,
      },
    });

    return NextResponse.json({ message: "Appointment deleted" });
  } catch (error) {
    console.error("Failed to delete appointment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
