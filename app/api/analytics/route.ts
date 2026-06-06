import { auth } from "@/lib/auth";
import { calculateAnalytics } from "@/lib/analytics";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const queryCompanyId = searchParams.get("companyId");
    const period = searchParams.get("period") || "this_month";

    const companyId = session?.user?.companyId || queryCompanyId;

    if (!companyId) {
      return new NextResponse("Unauthorized or missing companyId", { status: 401 });
    }

    const analytics = await calculateAnalytics(companyId, period);

    return NextResponse.json(analytics);
  } catch (error: any) {
    console.error("[ANALYTICS_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
