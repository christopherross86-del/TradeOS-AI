export const PRICING_PLANS = [
  {
    id: "price_sarah_monthly",
    name: "Sarah (AI Receptionist)",
    description: "24/7 call answering, appointment booking, SMS confirmations",
    price: 29900,
    interval: "month",
    features: [
      "24/7 call answering",
      "Appointment booking",
      "SMS confirmations",
    ],
  },
  {
    id: "price_sarahmike_monthly",
    name: "Sarah + Mike (Reception + Dispatch)",
    description: "Everything in Sarah + dispatch, route optimization, crew tracking",
    price: 59900,
    interval: "month",
    features: [
      "Everything in Sarah",
      "Dispatching",
      "Route optimization",
      "Crew tracking",
    ],
  },
  {
    id: "price_fulloffice_monthly",
    name: "Full AI Office",
    description: "Everything in Sarah+Mike + invoicing, analytics, automation",
    price: 99900,
    interval: "month",
    features: [
      "Everything in Sarah + Mike",
      "Invoicing",
      "Business analytics",
      "Workflow automation",
    ],
  },
];

export function getPlanById(id: string) {
  return PRICING_PLANS.find((plan) => plan.id === id);
}
