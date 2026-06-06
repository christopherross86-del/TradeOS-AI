import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  const { searchParams } = new URL(req.url);
  const queryCompanyId = searchParams.get("companyId");

  const companyId = session?.user?.companyId || queryCompanyId;

  if (!companyId) {
    return NextResponse.json(
      { error: "Unauthorized or missing companyId" },
      { status: 401 }
    );
  }

  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        brain: true,
      },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Transform brain entries into a flatter object
    const brainData = company.brain.reduce((acc, entry) => {
      acc[entry.key] = entry.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json({
      companyId: company.id,
      name: company.name,
      industry: company.industry,
      location: company.location,
      serviceArea: company.serviceArea,
      hours: company.hours,
      ...brainData,
    });
  } catch (error) {
    console.error("Failed to fetch onboarding data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();

  try {
    const body = await req.json();
    const { 
      companyId: bodyCompanyId, 
      industry, 
      serviceArea, 
      hours, 
      ...otherData 
    } = body;

    const companyId = session?.user?.companyId || bodyCompanyId;

    if (!companyId) {
      return NextResponse.json(
        { error: "Unauthorized or missing companyId" },
        { status: 401 }
      );
    }

    // Use a transaction to ensure all updates succeed or fail together
    await prisma.$transaction(async (tx) => {
      // 1. Update core Company fields
      await tx.company.update({
        where: { id: companyId },
        data: {
          industry,
          serviceArea,
          hours,
        },
      });

      // 2. Save all fields (including core ones and others) to CompanyBrain for reference
      // This includes everything sent in the payload
      const allEntries = {
        industry,
        serviceArea,
        hours,
        ...otherData,
      };

      for (const [key, value] of Object.entries(allEntries)) {
        if (value === undefined || value === null) continue;

        const stringValue = typeof value === "string" ? value : JSON.stringify(value);

        await tx.companyBrain.upsert({
          where: {
            companyId_key: {
              companyId,
              key,
            },
          },
          update: {
            value: stringValue,
          },
          create: {
            companyId,
            key,
            value: stringValue,
          },
        });
      }
    });

    return NextResponse.json({ message: "Onboarding data saved successfully" });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
