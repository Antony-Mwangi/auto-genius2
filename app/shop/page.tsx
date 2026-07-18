// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import Footer from "@/app/components/Footer";

// interface Product {
//   _id: string;
//   name: string;
//   price: number;
//   category: string;
//   imageUrl: string;
//   createdAt: string;
// }

// interface CartItem {
//   product: Product;
//   quantity: number;
// }

// export default function ShopPage() {
//   const router = useRouter();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedCategory, setSelectedCategory] = useState<string>("All");
//   const [categories, setCategories] = useState<string[]>([]);
//   const [cartCount, setCartCount] = useState(0);

//   useEffect(() => {
//     const savedCart = localStorage.getItem("autogenius_cart");
//     if (savedCart) {
//       try {
//         const parsed: CartItem[] = JSON.parse(savedCart);
//         setCartCount(parsed.reduce((acc, item) => acc + item.quantity, 0));
//       } catch (e) {
//         console.error(e);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         const res = await fetch("/api/products");
//         if (!res.ok) throw new Error("Failed to pull inventory records.");
//         const data: Product[] = await res.json();
//         setProducts(data);
//         const uniqueCats = ["All", ...Array.from(new Set(data.map((p) => p.category)))];
//         setCategories(uniqueCats);
//       } catch (err: any) {
//         setError(err.message || "Something went wrong.");
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchProducts();
//   }, []);

//   const addToCart = (product: Product) => {
//     const savedCart = localStorage.getItem("autogenius_cart");
//     let currentCart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];
    
//     const existingItem = currentCart.find((item) => item.product._id === product._id);
//     if (existingItem) {
//       currentCart = currentCart.map((item) =>
//         item.product._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
//       );
//     } else {
//       currentCart.push({ product, quantity: 1 });
//     }

//     localStorage.setItem("autogenius_cart", JSON.stringify(currentCart));
//     setCartCount(currentCart.reduce((acc, item) => acc + item.quantity, 0));
//     router.push("/cart");
//   };

//   const filteredProducts = selectedCategory === "All"
//     ? products
//     : products.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

//   return (
//     <main className="min-h-screen bg-[#0b0f14] text-white flex flex-col antialiased font-sans">
      
//       {/* HEADER */}
//       <header className="border-b border-white/10 bg-[#111827] px-4 sm:px-6 py-4 sticky top-0 z-40 shadow-md">
//         <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <Link href="/shop" className="text-xl font-black text-orange-500 tracking-wider shrink-0">
//               AUTOGENIUS
//             </Link>
//             <span className="hidden sm:inline-block text-xs bg-white/5 border border-white/10 text-gray-400 px-2.5 py-0.5 rounded-full font-bold">
//               Automotive Parts Hub
//             </span>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <Link 
//               href="/dashboard"
//               className="text-xs font-bold bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
//             >
//               <svg className="w-3.5 h-3.5 text-orange-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
//               </svg>
//               My Orders
//             </Link>

//             <Link 
//               href="/cart" 
//               className="relative p-2.5 rounded-xl border border-white/10 bg-[#0b0f14] hover:border-orange-500/30 transition flex items-center gap-2 text-xs sm:text-sm font-bold"
//             >
//               <svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
//               </svg>
//               <span className="hidden sm:inline">My Cart</span>
//               {cartCount > 0 && (
//                 <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">
//                   {cartCount}
//                 </span>
//               )}
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* HERO & FILTERS */}
//       <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-8 sm:pt-12 pb-4">
//         <div>
//           <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">Genuine Spare Parts Catalog</h1>
//           <p className="text-gray-400 text-xs sm:text-sm mt-1">Browse, filter, and access authentic automotive high-grade mechanical components.</p>
//         </div>
        
//         {categories.length > 1 && (
//           <div className="mt-6 pb-4 border-b border-white/5 overflow-x-auto scrollbar-none flex flex-nowrap gap-2 -mx-4 px-4 sm:mx-0 sm:px-0">
//             {categories.map((cat) => (
//               <button 
//                 key={cat} 
//                 onClick={() => setSelectedCategory(cat)} 
//                 className={`text-xs font-extrabold px-4 py-2.5 rounded-xl border transition shrink-0 cursor-pointer ${
//                   selectedCategory === cat 
//                     ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/10" 
//                     : "bg-[#111827] border-white/10 text-gray-400 hover:text-white hover:border-white/20"
//                 }`}
//               >
//                 {cat}
//               </button>
//             ))}
//           </div>
//         )}
//       </section>

//       {/* CATALOG GRID */}
//       <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 pb-16 flex-1 flex flex-col justify-start">
//         {loading && (
//           <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
//             <svg className="w-8 h-8 animate-spin text-orange-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
//             </svg>
//             <p className="text-xs font-bold tracking-wide uppercase">Syncing Warehouse Index...</p>
//           </div>
//         )}
        
//         {error && (
//           <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs font-bold my-6 flex items-center gap-2 max-w-md mx-auto w-full">
//             <span>Runtime Failure: {error}</span>
//           </div>
//         )}
        
//         {!loading && !error && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-4">
//             {filteredProducts.map((item) => (
//               <div key={item._id} className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-200 hover:border-white/20 group">
//                 <div className="aspect-square w-full relative bg-[#0b0f14] overflow-hidden">
//                   <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />
//                   <span className="absolute top-3 left-3 bg-[#0b0f14]/90 text-[9px] font-black text-orange-400 border border-orange-500/20 px-2.5 py-1 rounded-md uppercase tracking-wider">
//                     {item.category}
//                   </span>
//                 </div>
//                 <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-4">
//                   <h3 className="font-bold text-sm sm:text-base text-white line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
//                     {item.name}
//                   </h3>
//                   <div className="flex items-center justify-between pt-3 border-t border-white/5 gap-2">
//                     <span className="text-base sm:text-lg font-black text-white whitespace-nowrap">
//                       Ksh {item.price.toLocaleString()}
//                     </span>
//                     <button onClick={() => addToCart(item)} className="bg-orange-500 hover:bg-orange-400 text-white text-xs font-extrabold px-3 py-2 rounded-xl transition shadow-md shadow-orange-500/5 cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
//                       Add
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       {/* FOOTER */}
//       <Footer />
//     </main>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/app/components/Footer";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  chassisNumber?: string;
  description?: string;
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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [categories, setCategories] = useState<string[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        setFilteredProducts(data);
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

  // Filter products based on search term and category
  useEffect(() => {
    let result = products;
    
    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    
    // Filter by search term (chassis number, name, or description)
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter((p) => {
        const chassisMatch = p.chassisNumber ? p.chassisNumber.toLowerCase().includes(term) : false;
        const nameMatch = p.name.toLowerCase().includes(term);
        const descMatch = p.description ? p.description.toLowerCase().includes(term) : false;
        
        return chassisMatch || nameMatch || descMatch;
      });
    }
    
    setFilteredProducts(result);
  }, [products, selectedCategory, searchTerm]);

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

  const openProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeProductDetails = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    document.body.style.overflow = 'unset';
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeProductDetails();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <main className="min-h-screen bg-[#0b0f14] text-white flex flex-col antialiased font-sans">
      
      {/* HEADER */}
      <header className="border-b border-white/10 bg-[#111827] px-4 sm:px-6 py-4 sticky top-0 z-40 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/shop" className="text-xl font-black text-orange-500 tracking-wider shrink-0">
              AUTOGENIUS
            </Link>
            <span className="hidden sm:inline-block text-xs bg-white/5 border border-white/10 text-gray-400 px-2.5 py-0.5 rounded-full font-bold">
              Automotive Parts Hub
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard"
              className="text-xs font-bold bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 text-orange-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              My Orders
            </Link>

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
          </div>
        </div>
      </header>

      {/* HERO & FILTERS */}
      <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-8 sm:pt-12 pb-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">Genuine Spare Parts Catalog</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Browse, filter, and access authentic automotive high-grade mechanical components.</p>
        </div>
        
        {/* SEARCH BAR */}
        <div className="mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by chassis number, part name, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl p-3 pl-10 outline-none text-sm text-white placeholder-gray-500 focus:border-orange-500 transition"
            />
            <svg className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-[10px] text-gray-500 mt-1.5">
              Found {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "{searchTerm}"
            </p>
          )}
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

      {/* CATALOG GRID */}
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
            <span>Runtime Failure: {error}</span>
          </div>
        )}
        
        {!loading && !error && (
          <>
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-gray-400">
                <svg className="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <p className="text-sm font-medium">No products match your search criteria</p>
                <p className="text-xs text-gray-500">Try adjusting your search term or category filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-4">
                {filteredProducts.map((item) => (
                  <div key={item._id} className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-200 hover:border-orange-500/30 group">
                    {/* Clickable Image */}
                    <div 
                      className="aspect-square w-full relative bg-[#0b0f14] overflow-hidden cursor-pointer"
                      onClick={() => openProductDetails(item)}
                    >
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80";
                        }}
                      />
                      {/* Overlay with "View Details" */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg">
                          View Details
                        </span>
                      </div>
                      <span className="absolute top-3 left-3 bg-[#0b0f14]/90 text-[9px] font-black text-orange-400 border border-orange-500/20 px-2.5 py-1 rounded-md uppercase tracking-wider">
                        {item.category}
                      </span>
                      {item.chassisNumber && (
                        <span className="absolute bottom-3 left-3 bg-[#0b0f14]/90 text-[8px] font-mono text-gray-300 border border-white/10 px-2 py-0.5 rounded-md">
                          Chassis: {item.chassisNumber}
                        </span>
                      )}
                    </div>
                    <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-3">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-white line-clamp-2">
                          {item.name}
                        </h3>
                        {item.chassisNumber && (
                          <p className="text-[10px] font-mono text-orange-400/80 mt-1 truncate">
                            #{item.chassisNumber}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-white/5 gap-2">
                        <span className="text-base sm:text-lg font-black text-white whitespace-nowrap">
                          Ksh {item.price.toLocaleString()}
                        </span>
                        <button 
                          onClick={() => addToCart(item)} 
                          className="bg-orange-500 hover:bg-orange-400 text-white text-xs font-extrabold px-3 py-2 rounded-xl transition shadow-md shadow-orange-500/5 cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                          </svg>
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* PRODUCT DETAILS MODAL */}
      {isModalOpen && selectedProduct && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeProductDetails}
        >
          <div 
            className="bg-[#111827] border border-orange-500/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={closeProductDetails}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-xl text-white transition cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Product Image */}
              <div className="md:w-1/2 bg-[#0b0f14] p-4 md:p-6 flex items-center justify-center">
                <img 
                  src={selectedProduct.imageUrl} 
                  alt={selectedProduct.name} 
                  className="w-full h-auto max-h-[400px] object-contain rounded-xl"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80";
                  }}
                />
              </div>

              {/* Product Details */}
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col gap-4">
                <div>
                  <span className="text-xs font-black text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-md uppercase tracking-wider inline-block">
                    {selectedProduct.category}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                  {selectedProduct.name}
                </h2>

                {selectedProduct.chassisNumber && (
                  <div className="bg-[#1a1f2e] border border-orange-500/10 rounded-xl p-3">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Chassis Number</p>
                    <p className="text-sm font-mono text-orange-400 font-bold mt-0.5">
                      {selectedProduct.chassisNumber}
                    </p>
                  </div>
                )}

                {selectedProduct.description && (
                  <div className="bg-[#1a1f2e] border border-white/5 rounded-xl p-4">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Product Description</p>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>
                )}

                <div className="border-t border-white/10 pt-4 mt-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Price</p>
                      <p className="text-2xl font-black text-white">
                        Ksh {selectedProduct.price.toLocaleString()}
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        addToCart(selectedProduct);
                        closeProductDetails();
                      }}
                      className="bg-orange-500 hover:bg-orange-400 text-white font-extrabold px-6 py-3 rounded-xl transition shadow-lg shadow-orange-500/20 cursor-pointer flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <Footer />
    </main>
  );
}