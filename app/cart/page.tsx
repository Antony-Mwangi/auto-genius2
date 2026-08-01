"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CartItem {
  product: { _id: string; name: string; price: number; imageUrl: string; category: string };
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
    const nextCart = cart
      .map((item) => {
        if (item.product._id === productId)
          return { ...item, quantity: item.quantity + change };
        return item;
      })
      .filter((item) => item.quantity > 0);

    setCart(nextCart);
    localStorage.setItem("autogenius_cart", JSON.stringify(nextCart));
  };

  const removeItem = (productId: string) => {
    const nextCart = cart.filter((item) => item.product._id !== productId);
    setCart(nextCart);
    localStorage.setItem("autogenius_cart", JSON.stringify(nextCart));
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-6 animate-fade-in-down">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
              Your Shopping Cart
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold text-orange-500 hover:text-orange-600 hover:underline transition-colors duration-200"
          >
            ← Continue Shopping
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-24 bg-white border border-gray-200 rounded-2xl shadow-sm animate-fade-in">
            <p className="text-gray-500 font-medium text-lg">Your cart is currently empty.</p>
            <Link
              href="/shop"
              className="inline-block mt-4 text-orange-500 hover:text-orange-600 font-semibold underline"
            >
              Browse our shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-fade-in-up">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-5">
              {cart.map((item, index) => (
                <div
                  key={item.product._id}
                  className="flex items-center gap-5 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 relative group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex-1 min-w-0 pr-10">
                    <h3 className="font-bold text-base text-gray-900 truncate leading-tight">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-orange-500 font-bold mt-1">
                      Ksh {item.product.price.toLocaleString()}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={() => updateQuantity(item.product._id, -1)}
                        className="bg-gray-100 hover:bg-gray-200 border border-gray-200 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-gray-700 transition-colors duration-200 cursor-pointer"
                      >
                        −
                      </button>
                      <span className="text-sm font-mono font-bold w-6 text-center text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product._id, 1)}
                        className="bg-gray-100 hover:bg-gray-200 border border-gray-200 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-gray-700 transition-colors duration-200 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200 absolute top-5 right-5 cursor-pointer text-lg"
                    aria-label="Remove item"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 h-fit space-y-6 shadow-sm sticky top-6">
              <h3 className="font-extrabold text-xl text-gray-900 border-b border-gray-100 pb-4">
                Order Summary
              </h3>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">Ksh {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-100 pt-5">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="font-black text-2xl text-gray-900">
                  Ksh {totalPrice.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl text-base hover:bg-orange-400 active:scale-95 transition-all duration-200 shadow-lg shadow-orange-500/20 cursor-pointer text-center block"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}