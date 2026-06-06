# OperatorAI — Launch Guide

## Quick Deploy (Vercel)

1. Push code to GitHub (done ✅)
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repo (`TradeOS-AI`)
4. Add environment variables (see below)
5. Deploy 🚀

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Where to get it |
|----------|----------------|
| `DATABASE_URL` | Create a free DB on [Supabase](https://supabase.com) → Project Settings → Database → Connection string |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` in terminal |
| `NEXTAUTH_URL` | Your Vercel URL (e.g. `https://operatorai.vercel.app`) |
| `GOOGLE_CLIENT_ID` | [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → OAuth 2.0 |
| `GOOGLE_CLIENT_SECRET` | Same as above |
| `OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com/api-keys) |
| `TWILIO_ACCOUNT_SID` | [twilio.com/console](https://twilio.com/console) |
| `TWILIO_AUTH_TOKEN` | Same as above |
| `TWILIO_PHONE_NUMBER` | Buy a number in Twilio Console (~$2/mo) |
| `STRIPE_SECRET_KEY` | [dashboard.stripe.com](https://dashboard.stripe.com/apikeys) |
| `STRIPE_PUBLISHABLE_KEY` | Same as above |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks → Add endpoint: `https://yourdomain.com/api/stripe/webhook` |

## Post-Deploy Steps

### 1. Database
```bash
npx prisma db push
```

### 2. Stripe Webhook
In Stripe Dashboard → Webhooks → Add:
- Endpoint: `https://yourdomain.com/api/stripe/webhook`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

### 3. Twilio Phone Number
In Twilio Console → Phone Numbers → Your number → Voice Configuration:
- When a call comes in: Webhook → `https://yourdomain.com/api/twilio/incoming`
- Method: HTTP POST

### 4. Seed Subscription Plans
```bash
npx tsx prisma/seed-plans.ts
```

## Testing the Flow

1. Go to `https://yourdomain.com`
2. Click "Hire Sarah Today" → Register
3. Complete onboarding wizard
4. Dashboard → AI Employees → Hire Sarah
5. Dashboard → ROI Dashboard → See metrics
6. Test Sarah by calling your Twilio number

## Local Development

```bash
git clone https://github.com/christopherross86-del/TradeOS-AI.git
cd TradeOS-AI
npm install
cp .env.example .env.local
# Fill in .env.local
npx prisma db push
npm run dev
```

## Architecture Overview

```
operatorai/
├── app/
│   ├── (auth)/          # Login, Register, Onboarding
│   ├── api/             # All backend routes
│   │   ├── analytics/   # ROI metrics
│   │   ├── appointments/# Scheduling CRUD
│   │   ├── auth/        # NextAuth
│   │   ├── calls/       # Call logs
│   │   ├── chat/        # AI Command Center
│   │   ├── customers/   # CRM CRUD
│   │   ├── onboarding/  # Company setup
│   │   ├── register/    # Sign up
│   │   ├── stripe/      # Payments
│   │   └── twilio/      # Phone system
│   └── dashboard/       # All UI pages
│       ├── analytics/   # ROI Dashboard
│       ├── appointments/# Scheduling
│       ├── chat/        # Command Center
│       ├── customers/   # CRM
│       └── employees/   # AI Marketplace
├── lib/                 # Shared utilities
│   ├── auth.ts          # NextAuth config
│   ├── prisma.ts        # DB client
│   ├── stripe.ts        # Payments
│   ├── openai.ts        # AI
│   ├── twilio.ts        # Phone
│   └── analytics.ts     # ROI calculations
└── prisma/              # Database schema
    └── schema.prisma    # All models
```
