import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { companyName, name, email, password } = await req.json();

    if (!companyName || !name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create Company and User in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Company
      const company = await tx.company.create({
        data: {
          name: companyName,
        },
      });

      // 2. Create User
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "OWNER",
          companyId: company.id,
        },
      });

      // 3. Create default AI Employees
      const aiEmployees = [
        { name: "Sarah", type: "SARAH", companyId: company.id, status: "INACTIVE" },
        { name: "Mike", type: "MIKE", companyId: company.id, status: "INACTIVE" },
        { name: "Jessica", type: "JESSICA", companyId: company.id, status: "INACTIVE" },
        { name: "Alex", type: "ALEX", companyId: company.id, status: "INACTIVE" },
      ];

      await tx.aIEmployee.createMany({
        data: aiEmployees as any, // Cast because of Prisma enum types
      });

      return { company, user };
    });

    return NextResponse.json(
      {
        message: "Registration successful",
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
