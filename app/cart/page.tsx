"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CartItem {
  product: { _id: string; name: string; price: number; imageUrl: string; category: string; };
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("autogenius_cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const updateQuantity = (productId: string, change: number) => {
    const nextCart = cart.map((item) => {
      if (item.product._id === productId) return { ...item, quantity: item.quantity + change };
      return item;
    }).filter((item) => item.quantity > 0);
    
    setCart(nextCart);
    localStorage.setItem("autogenius_cart", JSON.stringify(nextCart));
  };

  const removeItem = (productId: string) => {
    const nextCart = cart.filter((item) => item.product._id !== productId);
    setCart(nextCart);
    localStorage.setItem("autogenius_cart", JSON.stringify(nextCart));
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <main className="min-h-screen bg-[#0b0f14] text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h1 className="text-3xl font-extrabold tracking-tight">Shopping Cart Manager</h1>
          <Link href="/shop" className="text-xs font-bold text-orange-400 hover:underline">← Continue Shopping</Link>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-[#111827] border border-white/10 rounded-2xl">
            <p className="text-gray-400 text-sm">Your cart is currently empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.product._id} className="flex items-center gap-4 bg-[#111827] border border-white/10 rounded-2xl p-4 relative">
                  <img src={item.product.imageUrl} alt={item.product.name} className="w-20 h-20 object-cover rounded-xl bg-[#0b0f14]" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-white truncate">{item.product.name}</h3>
                    <p className="text-xs text-orange-400 font-bold mt-1">Ksh {item.product.price.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <button onClick={() => updateQuantity(item.product._id, -1)} className="bg-white/5 border border-white/10 w-7 h-7 rounded-lg text-xs font-bold cursor-pointer">-</button>
                      <span className="text-xs font-mono font-bold px-2">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product._id, 1)} className="bg-white/5 border border-white/10 w-7 h-7 rounded-lg text-xs font-bold cursor-pointer">+</button>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.product._id)} className="text-gray-400 hover:text-red-400 text-sm absolute top-4 right-4 cursor-pointer">🗑️</button>
                </div>
              ))}
            </div>

            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 h-fit space-y-6 shadow-xl">
              <h3 className="font-extrabold text-lg border-b border-white/5 pb-2">Order Breakdown</h3>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Subtotal Sum</span>
                <span className="font-black text-xl text-white">Ksh {totalPrice.toLocaleString()}</span>
              </div>
              <button onClick={() => router.push("/checkout")} className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl text-sm hover:bg-orange-400 cursor-pointer text-center block">Proceed to Checkout</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}