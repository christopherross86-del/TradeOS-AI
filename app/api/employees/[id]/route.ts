import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.companyId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { status } = await req.json();

    if (!status || (status !== "ACTIVE" && status !== "INACTIVE")) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    // Verify the employee belongs to the company
    const employee = await prisma.aIEmployee.findUnique({
      where: {
        id,
      },
    });

    if (!employee || employee.companyId !== session.user.companyId) {
      return new NextResponse("Not Found or Unauthorized", { status: 404 });
    }

    const updatedEmployee = await prisma.aIEmployee.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(updatedEmployee);
  } catch (error: any) {
    console.error("[EMPLOYEE_PATCH_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
