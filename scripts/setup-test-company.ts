import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Find a test company
  const company = await prisma.company.findFirst();
  
  if (company) {
    const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
    
    await prisma.company.update({
      where: { id: company.id },
      data: {
        phoneNumber: twilioNumber
      }
    });
    
    console.log(`Linked ${twilioNumber} to ${company.name}`);
  } else {
    console.log("No company found to link.");
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
