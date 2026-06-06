import { prisma } from "./prisma";

export async function getSubscription(companyId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: {
      companyId: companyId,
      status: "ACTIVE",
    },
    include: {
      plan: true,
    },
  });

  return subscription;
}

export async function isActiveSubscription(companyId: string) {
  const subscription = await getSubscription(companyId);
  return !!subscription;
}
