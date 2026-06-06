import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const callSid = formData.get("CallSid") as string;
    const callStatus = formData.get("CallStatus") as string;
    const callDuration = formData.get("CallDuration") as string;

    await prisma.callLog.update({
      where: { id: callSid },
      data: {
        status: callStatus,
        duration: callDuration ? parseInt(callDuration) : null
      }
    });

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("[TWILIO_STATUS_ERROR]", error);
    return new Response("Error", { status: 500 });
  }
}
