"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  createdAt: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function ShopPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [categories, setCategories] = useState<string[]>([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem("autogenius_cart");
    if (savedCart) {
      try {
        const parsed: CartItem[] = JSON.parse(savedCart);
        setCartCount(parsed.reduce((acc, item) => acc + item.quantity, 0));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to pull inventory records.");
        const data: Product[] = await res.json();
        setProducts(data);
        const uniqueCats = ["All", ...Array.from(new Set(data.map((p) => p.category)))];
        setCategories(uniqueCats);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    const savedCart = localStorage.getItem("autogenius_cart");
    let currentCart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];
    
    const existingItem = currentCart.find((item) => item.product._id === product._id);
    if (existingItem) {
      currentCart = currentCart.map((item) =>
        item.product._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      currentCart.push({ product, quantity: 1 });
    }

    localStorage.setItem("autogenius_cart", JSON.stringify(currentCart));
    setCartCount(currentCart.reduce((acc, item) => acc + item.quantity, 0));
    router.push("/cart");
  };

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <main className="min-h-screen bg-[#0b0f14] text-white flex flex-col antialiased font-sans">
      
      {/* GLOBAL SHOP NAVIGATION HEADER */}
      <header className="border-b border-white/10 bg-[#111827] px-4 sm:px-6 py-4 sticky top-0 z-40 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link href="/shop" className="text-xl font-black text-orange-500 tracking-wider shrink-0">
            AUTOGENIUS
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Link 
              href="/cart" 
              className="relative p-2.5 rounded-xl border border-white/10 bg-[#0b0f14] hover:border-orange-500/30 transition flex items-center gap-2 text-xs sm:text-sm font-bold"
            >
              <svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              <span className="hidden sm:inline">My Cart</span>
              {cartCount > 0 && (
                <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <Link 
              href="/admin/login" 
              className="text-xs font-bold text-gray-400 hover:text-white border border-white/10 px-3 sm:px-4 py-2.5 rounded-xl bg-[#0b0f14] transition whitespace-nowrap"
            >
              Terminal Login
            </Link>
          </div>
        </div>
      </header>

      {/* VIEW HERO HEADER & RUNTIME HORIZONTAL FILTERS */}
      <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-8 sm:pt-12 pb-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">Genuine Spare Parts Catalog</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Browse, filter, and access authentic automotive high-grade mechanical components.</p>
        </div>
        
        {categories.length > 1 && (
          <div className="mt-6 pb-4 border-b border-white/5 overflow-x-auto scrollbar-none flex flex-nowrap gap-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)} 
                className={`text-xs font-extrabold px-4 py-2.5 rounded-xl border transition shrink-0 cursor-pointer ${
                  selectedCategory === cat 
                    ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/10" 
                    : "bg-[#111827] border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* CATALOG CORE GRID LAYOUT */}
      <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 pb-16 flex-1 flex flex-col justify-start">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
            <svg className="w-8 h-8 animate-spin text-orange-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <p className="text-xs font-bold tracking-wide uppercase">Syncing Warehouse Index...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs font-bold my-6 flex items-center gap-2 max-w-md mx-auto w-full">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <span>Runtime Failure: {error}</span>
          </div>
        )}
        
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-4">
            {filteredProducts.map((item) => (
              <div key={item._id} className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-200 hover:border-white/20 group">
                
                <div className="aspect-square w-full relative bg-[#0b0f14] overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" 
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80"; }} 
                  />
                  <span className="absolute top-3 left-3 bg-[#0b0f14]/90 text-[9px] font-black text-orange-400 border border-orange-500/20 px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
                
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-4">
                  <h3 className="font-bold text-sm sm:text-base text-white line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
                    {item.name}
                  </h3>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-white/5 gap-2">
                    <span className="text-base sm:text-lg font-black text-white whitespace-nowrap">
                      Ksh {item.price.toLocaleString()}
                    </span>
                    <button 
                      onClick={() => addToCart(item)} 
                      className="bg-orange-500 hover:bg-orange-400 text-white text-xs font-extrabold px-3 py-2 rounded-xl transition shadow-md shadow-orange-500/5 cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Add
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-[#111827] border border-white/10 rounded-2xl text-gray-400 text-sm font-medium">
            No active spare components indexed under this category assignment.
          </div>
        )}
      </section>
    </main>
  );
}