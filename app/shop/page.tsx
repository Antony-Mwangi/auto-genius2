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
    router.push("/cart"); // Instantly redirect to dedicated page view
  };

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <main className="min-h-screen bg-[#0b0f14] text-white flex flex-col">
      <header className="border-b border-white/10 bg-[#111827] px-6 py-4 sticky top-0 z-40 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/shop" className="text-xl font-black text-orange-500 tracking-wider">AUTOGENIUS</Link>
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative p-2.5 rounded-xl border border-white/10 bg-[#0b0f14] hover:border-orange-500/30 transition flex items-center gap-2 text-sm">
              <span>🛒</span> <span className="font-bold">My Cart</span>
              {cartCount > 0 && <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-black">{cartCount}</span>}
            </Link>
            <Link href="/admin/login" className="text-xs font-semibold text-gray-400 border border-white/10 px-4 py-2 rounded-xl bg-[#0b0f14]">Terminal Login</Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto w-full px-6 pt-12 pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight">Genuine Spare Parts Catalog</h1>
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mt-6 pb-6 border-b border-white/5">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`text-xs font-bold px-4 py-2.5 rounded-xl border cursor-pointer ${selectedCategory === cat ? "bg-orange-500 text-white" : "bg-[#111827] border-white/10 text-gray-400"}`}>{cat}</button>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto w-full px-6 pb-16 flex-1">
        {loading && <p className="text-center py-20 text-xs text-gray-400">Loading Warehouse Index...</p>}
        {error && <p className="text-center text-red-400 my-8">⚠️ {error}</p>}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {filteredProducts.map((item) => (
            <div key={item._id} className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between group">
              <div className="aspect-square w-full relative bg-[#0b0f14]">
                <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80"; }} />
                <span className="absolute top-3 left-3 bg-[#0b0f14]/80 text-[10px] font-bold text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-md uppercase">{item.category}</span>
              </div>
              <div className="p-5 space-y-4">
                <h3 className="font-bold text-base text-white line-clamp-2 min-h-[3rem]">{item.name}</h3>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-lg font-black text-white">Ksh {item.price.toLocaleString()}</span>
                  <button onClick={() => addToCart(item)} className="bg-orange-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-orange-400 cursor-pointer">Add To Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}