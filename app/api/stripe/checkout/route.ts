import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    // We expect companyId to be provided, either from session or body
    const body = await req.json();
    const companyId = session?.user?.companyId || body.companyId;

    if (!companyId) {
      return new NextResponse("Missing companyId", { status: 400 });
    }

    const { priceId } = body;

    if (!priceId) {
      return new NextResponse("Price ID is required", { status: 400 });
    }

    // DEVELOPMENT MOCK: Return a mock checkout URL
    const mockUrl = `https://checkout.stripe.com/mock/session_${companyId}`;

    return NextResponse.json({ url: mockUrl });
  } catch (error: any) {
    console.error("[STRIPE_CHECKOUT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
