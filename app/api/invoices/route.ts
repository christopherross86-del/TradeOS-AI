import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  const { searchParams } = new URL(req.url);
  const queryCompanyId = searchParams.get("companyId");

  const companyId = session?.user?.companyId || queryCompanyId;

  if (!companyId) {
    return NextResponse.json({ error: "Unauthorized or missing companyId" }, { status: 401 });
  }

  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        companyId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Failed to fetch invoices:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();

  try {
    const body = await req.json();
    const { number, amount, status, companyId: bodyCompanyId } = body;

    const companyId = session?.user?.companyId || bodyCompanyId;

    if (!companyId) {
      return NextResponse.json({ error: "Unauthorized or missing companyId" }, { status: 401 });
    }

    if (amount === undefined || amount === null) {
      return NextResponse.json({ error: "Amount is required" }, { status: 400 });
    }

    let invoiceNumber = number;
    if (!invoiceNumber) {
      // Generate incremental invoice number
      const lastInvoice = await prisma.invoice.findFirst({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
      });

      if (lastInvoice && lastInvoice.number.startsWith('INV-')) {
        const lastNum = parseInt(lastInvoice.number.replace('INV-', ''), 10);
        if (!isNaN(lastNum)) {
          invoiceNumber = `INV-${String(lastNum + 1).padStart(3, '0')}`;
        } else {
          invoiceNumber = 'INV-001';
        }
      } else {
        invoiceNumber = 'INV-001';
      }
    }

    const invoice = await prisma.invoice.create({
      data: {
        number: invoiceNumber,
        amount,
        status: status || "DRAFT",
        companyId,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("Failed to create invoice:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
