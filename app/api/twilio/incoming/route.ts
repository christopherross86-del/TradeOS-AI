import { prisma } from "@/lib/prisma";
import twilio from "twilio";
import { NextResponse } from "next/server";

const VoiceResponse = twilio.twiml.VoiceResponse;

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");
    const formData = await req.formData();
    
    const to = formData.get("To") as string;
    const callSid = formData.get("CallSid") as string;
    const from = formData.get("From") as string;

    // 1. Identify the company
    const company = await prisma.company.findFirst({
      where: { 
        OR: [
          { id: companyId || undefined },
          { phoneNumber: to }
        ]
      }
    });

    if (!company) {
      const response = new VoiceResponse();
      response.say("I'm sorry, this business is not recognized. Goodbye.");
      return new Response(response.toString(), { 
        headers: { "Content-Type": "text/xml" } 
      });
    }

    // 2. Create CallLog
    await prisma.callLog.create({
      data: {
        id: callSid,
        companyId: company.id,
        from,
        to,
        status: "in-progress"
      }
    });

    const response = new VoiceResponse();
    const welcomeMessage = `Hello, thank you for calling ${company.name}. I'm Sarah, your AI receptionist. How can I help you today?`;
    
    const gather = response.gather({
      input: ["speech"],
      action: `/api/twilio/process-call?companyId=${company.id}`,
      speechTimeout: "auto",
      language: "en-US"
    });
    gather.say(welcomeMessage);

    // Fallback if they don't say anything
    response.say("I'm sorry, I didn't hear anything. Please try calling back later. Goodbye.");

    return new Response(response.toString(), { 
      headers: { "Content-Type": "text/xml" } 
    });
  } catch (error) {
    console.error("[TWILIO_INCOMING_ERROR]", error);
    const response = new VoiceResponse();
    response.say("An error occurred. Please try again later.");
    return new Response(response.toString(), { 
      headers: { "Content-Type": "text/xml" } 
    });
  }
}

// GET endpoint to simulate a call flow for demo purposes
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json({ error: "companyId is required" }, { status: 400 });
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Return a JSON representation of what the call flow WOULD be
    return NextResponse.json({
      simulation: true,
      flow: [
        {
          step: "Incoming Call",
          action: "TwiML generated",
          response: `Hello, thank you for calling ${company.name}. I'm Sarah, your AI receptionist. How can I help you today?`,
          collect: "Speech input"
        },
        {
          step: "Processing Speech",
          examples: [
            {
              input: "I have an emergency leak!",
              outcome: "Creates urgent appointment, says: 'I understand this is an emergency. We'll get someone out to you right away...'"
            },
            {
              input: "I'd like to book a maintenance visit next Tuesday.",
              outcome: "Creates NEW_REQUEST appointment, says: 'I can help with that. I've noted your request for an appointment...'"
            }
          ]
        }
      ]
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
