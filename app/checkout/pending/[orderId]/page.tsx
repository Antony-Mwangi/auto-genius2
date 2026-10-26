"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type PaymentState = "checking" | "pending" | "paid" | "failed" | "timeout" | "unavailable";

export default function PendingPaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const [state, setState] = useState<PaymentState>("checking");
  const [receipt, setReceipt] = useState<string | null>(null);
  const [storeReceipt, setStoreReceipt] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const checkStatus = useCallback(async (token: string) => {
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: "GET",
      headers: { "x-order-payment-token": token },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Unable to check this order.");
    return response.json() as Promise<{
      status: string;
      mpesaReceipt?: string | null;
      generatedReceipt?: string | null;
    }>;
  }, [orderId]);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const token = sessionStorage.getItem(`mpesa-order-token:${orderId}`);

    if (!token) {
      setState("unavailable");
      return;
    }

    const poll = async (tries: number) => {
      try {
        const data = await checkStatus(token);
        if (!active) return;
        if (data.status === "paid") {
          setReceipt(data.mpesaReceipt || null);
          setStoreReceipt(data.generatedReceipt || null);
          setState("paid");
          sessionStorage.removeItem(`mpesa-order-token:${orderId}`);
          localStorage.removeItem("autogenius_cart");
          return;
        }
        if (data.status === "failed") {
          setState("failed");
          sessionStorage.removeItem(`mpesa-order-token:${orderId}`);
          return;
        }
        setState("pending");
      } catch {
        if (!active) return;
      }

      if (tries >= 29) {
        if (active) setState("timeout");
        return;
      }
      if (active) {
        setAttempt(tries + 1);
        timer = setTimeout(() => void poll(tries + 1), 2000);
      }
    };

    void poll(0);
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [checkStatus, orderId]);

  const recheck = async () => {
    const token = sessionStorage.getItem(`mpesa-order-token:${orderId}`);
    if (!token) {
      setState("unavailable");
      return;
    }
    setState("checking");
    setAttempt(0);
    try {
      const data = await checkStatus(token);
      if (data.status === "paid") {
        setReceipt(data.mpesaReceipt || null);
        setStoreReceipt(data.generatedReceipt || null);
        setState("paid");
        sessionStorage.removeItem(`mpesa-order-token:${orderId}`);
        localStorage.removeItem("autogenius_cart");
      } else if (data.status === "failed") {
        setState("failed");
        sessionStorage.removeItem(`mpesa-order-token:${orderId}`);
      } else {
        setState("timeout");
      }
    } catch {
      setState("timeout");
    }
  };

  const copy = {
    checking: { title: "Checking payment…", detail: "Please wait while we check your order." },
    pending: { title: "Awaiting payment confirmation", detail: "Approve the M-Pesa prompt on your phone. This page will update when Kopo Kopo confirms the payment." },
    paid: { title: "Payment successful", detail: "Kopo Kopo confirmed your payment." },
    failed: { title: "Payment failed or cancelled", detail: "No successful payment was confirmed for this order." },
    timeout: { title: "Payment timeout", detail: "No callback arrived within 60 seconds. Please check your order status later; do not assume the payment failed." },
    unavailable: { title: "Order status unavailable", detail: "This browser session does not have the secure token needed to view this order." },
  }[state];

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 flex items-center justify-center">
      <section className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-xl">
        <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full text-3xl ${state === "paid" ? "bg-green-100" : state === "failed" ? "bg-red-100" : "bg-orange-100"}`}>
          {state === "paid" ? "✓" : state === "failed" ? "×" : state === "pending" || state === "checking" ? "…" : "!"}
        </div>
        <h1 className="text-2xl font-black text-gray-900">{copy.title}</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">{copy.detail}</p>
        <p className="mt-4 text-xs text-gray-400">Order #{orderId.slice(-6).toUpperCase()}</p>
        {state === "paid" && receipt && (
          <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 font-mono text-sm font-bold text-green-800">
            M-Pesa transaction reference: {receipt}
          </p>
        )}
        {state === "paid" && storeReceipt && (
          <p className="mt-3 rounded-xl bg-green-50 px-4 py-3 font-mono text-sm font-bold text-green-800">
            Store receipt: {storeReceipt}
          </p>
        )}
        {state === "pending" && (
          <p className="mt-4 text-xs text-gray-400">Checking for callback… ({attempt + 1}/30)</p>
        )}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {state === "timeout" && (
            <button onClick={recheck} className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600">
              Check status again
            </button>
          )}
          {(state === "failed" || state === "timeout" || state === "unavailable") && (
            <button onClick={() => router.push("/checkout")} className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50">
              Return to checkout
            </button>
          )}
          {state === "paid" && (
            <button onClick={() => router.push("/dashboard")} className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600">
              View my orders
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
