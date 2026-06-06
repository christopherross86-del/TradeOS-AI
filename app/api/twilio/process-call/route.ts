import { prisma } from "@/lib/prisma";
import twilio from "twilio";

const VoiceResponse = twilio.twiml.VoiceResponse;

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");
    const formData = await req.formData();
    
    const speechResult = formData.get("SpeechResult") as string;
    const from = formData.get("From") as string;
    const callSid = formData.get("CallSid") as string;

    if (!companyId) {
      throw new Error("Missing companyId");
    }

    const lowerSpeech = speechResult?.toLowerCase() || "";
    const response = new VoiceResponse();

    // Update CallLog transcript
    await prisma.callLog.update({
      where: { id: callSid },
      data: { transcript: (speechResult || "") }
    });

    // Find or create customer
    let customer = await prisma.customer.findFirst({
      where: { phone: from, companyId }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: "New Customer",
          phone: from,
          companyId
        }
      });
    }

    if (lowerSpeech.includes("emergency") || lowerSpeech.includes("urgent")) {
      await prisma.appointment.create({
        data: {
          companyId,
          customerId: customer.id,
          status: "NEW_REQUEST"
        }
      });
      response.say("I understand this is an emergency. We'll get someone out to you right away. A member of our team will contact you at this number immediately.");
      response.hangup();
    } else if (lowerSpeech.includes("appointment") || lowerSpeech.includes("schedule") || lowerSpeech.includes("book")) {
      await prisma.appointment.create({
        data: {
          companyId,
          customerId: customer.id,
          status: "NEW_REQUEST"
        }
      });
      response.say("I can help with that. I've noted your request for an appointment. Someone will call you shortly to find an available time that works for you.");
      response.hangup();
    } else {
      response.say("I've taken down your information. One of our specialists will reach out to you shortly to assist you further. Thank you for calling!");
      response.hangup();
    }

    return new Response(response.toString(), { 
      headers: { "Content-Type": "text/xml" } 
    });
  } catch (error) {
    console.error("[TWILIO_PROCESS_ERROR]", error);
    const response = new VoiceResponse();
    response.say("I'm sorry, I'm having trouble processing your request. Please try again later.");
    return new Response(response.toString(), { 
      headers: { "Content-Type": "text/xml" } 
    });
  }
}
