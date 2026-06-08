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
    const invoice = await prisma.invoice.findUnique({
      where: {
        id,
        companyId,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Failed to fetch invoice:", error);
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
    const { number, amount, status, companyId: bodyCompanyId } = body;

    const companyId = session?.user?.companyId || bodyCompanyId;

    if (!companyId) {
      return NextResponse.json({ error: "Unauthorized or missing companyId" }, { status: 401 });
    }

    const invoice = await prisma.invoice.update({
      where: {
        id,
        companyId,
      },
      data: {
        number,
        amount,
        status,
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Failed to update invoice:", error);
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
    await prisma.invoice.delete({
      where: {
        id,
        companyId,
      },
    });

    return NextResponse.json({ message: "Invoice deleted" });
  } catch (error) {
    console.error("Failed to delete invoice:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
