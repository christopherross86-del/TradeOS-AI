import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  const { searchParams } = new URL(req.url);
  const queryCompanyId = searchParams.get("companyId");
  const status = searchParams.get("status");

  const companyId = session?.user?.companyId || queryCompanyId;

  if (!companyId) {
    return NextResponse.json({ error: "Unauthorized or missing companyId" }, { status: 401 });
  }

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        companyId,
        ...(status ? { status: status as any } : {}),
      },
      include: {
        customer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();

  try {
    const body = await req.json();
    const { customerId, scheduledAt, status, companyId: bodyCompanyId } = body;

    const companyId = session?.user?.companyId || bodyCompanyId;

    if (!companyId) {
      return NextResponse.json({ error: "Unauthorized or missing companyId" }, { status: 401 });
    }

    if (!customerId) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        customerId,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: status || "NEW_REQUEST",
        companyId,
      },
      include: {
        customer: true,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Failed to create appointment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
