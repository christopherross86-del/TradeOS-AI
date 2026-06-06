import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Mock conversation history
const MOCK_HISTORY = [
  { role: "user", content: "How many jobs did we do last week?", timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
  { role: "assistant", content: "You completed 38 jobs last week.", timestamp: new Date(Date.now() - 86400000 * 2 + 1000).toISOString() },
  { role: "user", content: "What is our revenue for the month?", timestamp: new Date(Date.now() - 86400000).toISOString() },
  { role: "assistant", content: "Your revenue for this month is $96,400.", timestamp: new Date(Date.now() - 86400000 + 1000).toISOString() },
];

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const { message, companyId: bodyCompanyId } = body;

    const companyId = session?.user?.companyId || bodyCompanyId;

    if (!companyId) {
      return new NextResponse("Missing companyId", { status: 400 });
    }

    if (!message) {
      return new NextResponse("Message is required", { status: 400 });
    }

    const lowerMessage = message.toLowerCase();

    // INTEGRATION POINT: This is where you would call OpenAI
    // const response = await openai.chat.completions.create({ ... })

    // For MVP: Return structured mock responses based on question type
    let reply = "";
    let data = {
      jobsCompleted: 42,
      revenue: 96400,
      newAppointments: 18,
      callsAnswered: 426
    };
    let type: "revenue" | "performance" | "customers" | "general" = "general";

    if (lowerMessage.includes("revenue") || lowerMessage.includes("money") || lowerMessage.includes("earn")) {
      type = "revenue";
      reply = `You generated $${data.revenue.toLocaleString()} in revenue so far this period. You're on track to beat last month by 12%.`;
    } else if (lowerMessage.includes("job") || lowerMessage.includes("performance") || lowerMessage.includes("done")) {
      type = "performance";
      reply = `You completed ${data.jobsCompleted} jobs this week, and Sarah booked ${data.newAppointments} new appointments. Performance is up 5% from last week.`;
    } else if (lowerMessage.includes("customer") || lowerMessage.includes("client")) {
      type = "customers";
      reply = `You added 12 new customers this week. Sarah handled 426 calls, ensuring no lead was missed.`;
    } else {
      type = "general";
      reply = `Hello! I'm your OperatorAI assistant. Currently, you have ${data.jobsCompleted} jobs completed this week and $${data.revenue.toLocaleString()} in revenue. How can I help you manage your business today?`;
    }

    return NextResponse.json({
      reply,
      data,
      type
    });
  } catch (error: any) {
    console.error("[CHAT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const companyId = session?.user?.companyId || searchParams.get("companyId");

    if (!companyId) {
      return new NextResponse("Missing companyId", { status: 400 });
    }

    // Return mock history for now
    return NextResponse.json(MOCK_HISTORY);
  } catch (error: any) {
    console.error("[CHAT_HISTORY_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
