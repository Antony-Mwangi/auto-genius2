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

## M-Pesa payments (Daraja STK Push)

The checkout uses Safaricom Daraja STK Push. Copy `.env.example` to `.env.local` and add the Daraja credentials from your Safaricom Developer Portal app:

- `MPESA_ENV`: `sandbox` while testing; use `production` only after production access is approved.
- `MPESA_CONSUMER_KEY` and `MPESA_CONSUMER_SECRET`: server-side OAuth credentials.
- `MPESA_SHORTCODE` and `MPESA_PASSKEY`: the shortcode and Lipa Na M-Pesa Online passkey for that Daraja app.
- `MPESA_BASE_URL`: use `https://sandbox.safaricom.co.ke` in sandbox; production defaults to Safaricom's production Daraja host.
- `MPESA_CALLBACK_URL`: the full public HTTPS URL ending in `/api/mpesa/callback`. Daraja must be able to reach it; localhost is not reachable from Safaricom.

For local callback testing, start the app with `npm run dev`, run `ngrok http 3000`, then set `MPESA_CALLBACK_URL` to `https://<your-ngrok-host>/api/mpesa/callback`. The Safaricom sandbox test phone is `254708374149`. Approve the PIN prompt to test success; choose Cancel to test failure (`ResultCode` 1032). Callbacks commonly arrive within 5–30 seconds. The STK Push response only confirms that Daraja accepted the request; the callback is what updates the order to paid or failed.

Restart the Next.js server after changing `.env.local`. Keep all Daraja secrets out of browser-prefixed variables, source control, and client logs. For production, switch credentials/shortcode and environment together, configure the production callback URL, and make sure the deployed app uses HTTPS.

The server derives item prices and shipping fees from the database/configuration; it does not trust a price or total sent by the browser. Payment completion is recorded from the callback and displayed by polling the protected order-status endpoint.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
