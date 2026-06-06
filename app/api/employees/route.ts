import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const queryCompanyId = searchParams.get("companyId");

    const companyId = session?.user?.companyId || queryCompanyId;

    if (!companyId) {
      return new NextResponse("Unauthorized or missing companyId", { status: 401 });
    }

    const employees = await prisma.aIEmployee.findMany({
      where: {
        companyId: companyId,
      },
      orderBy: {
        type: "asc",
      },
    });

    return NextResponse.json(employees);
  } catch (error: any) {
    console.error("[EMPLOYEES_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
