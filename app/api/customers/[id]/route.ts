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
    const customer = await prisma.customer.findUnique({
      where: {
        id,
        companyId,
      },
      include: {
        appointments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Failed to fetch customer:", error);
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
    const { name, email, phone, address, serviceHistory, companyId: bodyCompanyId } = body;

    const companyId = session?.user?.companyId || bodyCompanyId;

    if (!companyId) {
      return NextResponse.json({ error: "Unauthorized or missing companyId" }, { status: 401 });
    }

    const customer = await prisma.customer.update({
      where: {
        id,
        companyId,
      },
      data: {
        name,
        email,
        phone,
        address,
        serviceHistory,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Failed to update customer:", error);
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
    await prisma.customer.delete({
      where: {
        id,
        companyId,
      },
    });

    return NextResponse.json({ message: "Customer deleted" });
  } catch (error) {
    console.error("Failed to delete customer:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
