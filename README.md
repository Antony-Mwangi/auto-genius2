This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## M-Pesa payments (Kopo Kopo STK Push)

Checkout initiates an M-Pesa STK Push through Kopo Kopo K2 Connect. Copy `.env.example` to `.env.local` and set `KOPOKOPO_CLIENT_ID`, `KOPOKOPO_CLIENT_SECRET`, `KOPOKOPO_API_KEY`, and `KOPOKOPO_TILL_NUMBER` from the corresponding Kopo Kopo environment. Never expose these as `NEXT_PUBLIC_` variables.

- For sandbox, use `KOPOKOPO_BASE_URL=https://sandbox.kopokopo.com` and sandbox credentials. Sandbox transactions are simulations and do not generate real-money STK PIN prompts.
- For production, use approved production credentials and `KOPOKOPO_BASE_URL=https://api.kopokopo.com`. The merchant dashboard URL `https://app.kopokopo.com` is not the API host; the integration maps that exact value to the production API host for compatibility.
- `KOPOKOPO_CALLBACK_URL` must be a public HTTPS URL ending in `/api/mpesa/callback`. Kopo Kopo signs callbacks with `X-KopoKopo-Signature`; the endpoint validates the HMAC-SHA256 signature against the client secret or API key used by the installed SDK before updating an order.

For local development, run `npm run dev`, expose port 3000 with `ngrok http 3000`, and set `KOPOKOPO_CALLBACK_URL` to `https://<your-ngrok-host>/api/mpesa/callback`. Configure the same callback URL in your Kopo Kopo app if required. Restart Next.js after changing `.env.local`. Kopo Kopo's sandbox simulates transactions and does not send real PIN prompts; use its dashboard/test flow for sandbox verification. Use production credentials and the production API host only for approved live transactions.

The STK initiation response indicates only that Kopo Kopo accepted the request. The signed asynchronous callback is the authority for payment success/failure. The order status endpoint is polled by the awaiting-payment page; it never marks a payment as successful itself. The server also calculates prices and shipping from trusted product data rather than browser-supplied totals.

After a successful callback is verified, the order is marked `paid` and assigned a unique AutoGenius store receipt number. The customer dashboard displays the green Paid badge, store receipt number, and Kopo Kopo/M-Pesa transaction reference.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
