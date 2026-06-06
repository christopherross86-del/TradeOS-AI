import { prisma } from "../lib/prisma";

async function main() {
  const plans = [
    {
      id: "price_sarah_basic", // Replace with real Stripe Price ID
      name: "Sarah (AI Receptionist)",
      description: "AI Receptionist that answers calls and books appointments.",
      price: 299,
      interval: "month",
      features: "Sarah AI, Call Answering, Appointment Booking",
    },
    {
      id: "price_sarah_mike", // Replace with real Stripe Price ID
      name: "Sarah + Mike (Reception + Dispatch)",
      description: "AI Receptionist and AI Dispatcher for your business.",
      price: 599,
      interval: "month",
      features: "Sarah AI, Mike AI, Dispatching, Everything in Sarah plan",
    },
    {
      id: "price_full_office", // Replace with real Stripe Price ID
      name: "Full AI Office",
      description: "Complete AI team for your service business.",
      price: 999,
      interval: "month",
      features: "All AI Employees, Priority Support, Enterprise Analytics",
    },
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { id: plan.id },
      update: plan,
      create: plan,
    });
  }

  console.log("Subscription plans seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
