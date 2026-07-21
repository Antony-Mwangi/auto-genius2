
// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import Footer from "@/app/components/Footer";

// // SVG Icons
// const Icons = {
//   WhatsApp: () => (
//     <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
//       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
//     </svg>
//   ),
//   Globe: () => (
//     <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <circle cx="12" cy="12" r="10"/>
//       <line x1="2" y1="12" x2="22" y2="12"/>
//       <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
//     </svg>
//   ),
//   Check: () => (
//     <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M20 6L9 17l-5-5"/>
//     </svg>
//   ),
//   X: () => (
//     <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <line x1="18" y1="6" x2="6" y2="18"/>
//       <line x1="6" y1="6" x2="18" y2="18"/>
//     </svg>
//   ),
//   Package: () => (
//     <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z"/>
//       <polyline points="2.32 6.16 12 11 21.68 6.16"/>
//       <line x1="12" y1="22.76" x2="12" y2="11"/>
//     </svg>
//   ),
//   Cart: () => (
//     <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <circle cx="9" cy="21" r="1"/>
//       <circle cx="20" cy="21" r="1"/>
//       <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
//     </svg>
//   ),
//   Search: () => (
//     <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <circle cx="11" cy="11" r="8"/>
//       <line x1="21" y1="21" x2="16.65" y2="16.65"/>
//     </svg>
//   ),
//   Close: () => (
//     <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <line x1="18" y1="6" x2="6" y2="18"/>
//       <line x1="6" y1="6" x2="18" y2="18"/>
//     </svg>
//   ),
//   Airplane: () => (
//     <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M12 2L2 7l10 5 10-5-10-5z"/>
//       <path d="M2 17l10 5 10-5"/>
//       <path d="M2 12l10 5 10-5"/>
//     </svg>
//   ),
//   Ship: () => (
//     <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M2 21h20"/>
//       <path d="M3 14h18"/>
//       <path d="M4 10l4-7 4 7"/>
//       <path d="M12 3l4 7 4-7"/>
//       <path d="M4 14l4 7 4-7"/>
//       <path d="M12 14l4 7 4-7"/>
//     </svg>
//   ),
//   User: () => (
//     <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
//       <circle cx="12" cy="7" r="4"/>
//     </svg>
//   ),
//   Order: () => (
//     <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
//       <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
//     </svg>
//   ),
//   Spinner: () => (
//     <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
//       <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
//     </svg>
//   ),
//   ViewDetails: () => (
//     <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
//       <circle cx="12" cy="12" r="3"/>
//     </svg>
//   )
// };

// interface Product {
//   _id: string;
//   name: string;
//   price: number;
//   category: string;
//   chassisNumber?: string | null;
//   description?: string;
//   imageUrl: string;
//   createdAt: string;
//   quantity: number;
//   supplierAvailable: boolean;
//   supplierName?: string;
//   supplierDeliveryTime?: string;
//   supplierShippingCost?: number;
//   shippingOptions?: {
//     air?: { enabled: boolean; deliveryTime: string; cost: number; description: string };
//     sea?: { enabled: boolean; deliveryTime: string; cost: number; description: string };
//   };
//   restockDate?: string;
//   lowStockThreshold?: number;
//   availabilityStatus?: string;
//   availabilityDisplay?: {
//     status: string;
//     badgeColor: string;
//     icon: string;
//     message: string;
//     quantity?: number;
//     deliveryEstimate?: string;
//     isLowStock?: boolean;
//     supplierName?: string;
//     shippingCost?: number;
//     shippingOptions?: Array<{
//       method: string;
//       label: string;
//       deliveryTime: string;
//       cost: number;
//       description: string;
//     }>;
//     restockDate?: string;
//     restockMessage?: string;
//   };
//   isPurchasable?: boolean;
//   isLowStock?: boolean;
// }

// interface CartItem {
//   product: Product;
//   quantity: number;
// }

// export default function ShopPage() {
//   const router = useRouter();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedCategory, setSelectedCategory] = useState<string>("All");
//   const [categories, setCategories] = useState<string[]>([]);
//   const [cartCount, setCartCount] = useState(0);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const WHATSAPP_NUMBER = "254714200500";

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
//         setFilteredProducts(data);
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

//   useEffect(() => {
//     let result = products;
    
//     if (selectedCategory !== "All") {
//       result = result.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
//     }
    
//     if (searchTerm.trim()) {
//       const term = searchTerm.trim().toLowerCase();
//       result = result.filter((p) => {
//         const chassisMatch = p.chassisNumber ? p.chassisNumber.toLowerCase().includes(term) : false;
//         const nameMatch = p.name.toLowerCase().includes(term);
//         const descMatch = p.description ? p.description.toLowerCase().includes(term) : false;
//         return chassisMatch || nameMatch || descMatch;
//       });
//     }
    
//     setFilteredProducts(result);
//   }, [products, selectedCategory, searchTerm]);

//   const addToCart = (product: Product) => {
//     if (!product.isPurchasable) {
//       alert("This product is currently not available for purchase.");
//       return;
//     }

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

//   const openProductDetails = (product: Product) => {
//     setSelectedProduct(product);
//     setIsModalOpen(true);
//     document.body.style.overflow = 'hidden';
//   };

//   const closeProductDetails = () => {
//     setIsModalOpen(false);
//     setSelectedProduct(null);
//     document.body.style.overflow = 'unset';
//   };

//   const handleQuoteRequest = (product: Product) => {
//     const message = `
// Hello Auto Genius Team,

// I would like to request a quote for the following product:

// Product: ${product.name}
// Category: ${product.category}
// Price: Ksh ${product.price.toLocaleString()}
// Chassis Number: ${product.chassisNumber || 'N/A'}
// Description: ${product.description || 'No description available'}
// Status: ${product.availabilityStatus === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Available from International Supplier'}

// I would like to know:
// 1. Availability and lead time
// 2. Total cost including shipping
// 3. Any additional charges

// Please get back to me with a quotation.

// Thank you!`.trim();

//     const encodedMessage = encodeURIComponent(message);
//     const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
//     window.open(whatsappUrl, '_blank');
//   };

//   useEffect(() => {
//     const handleEsc = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') {
//         closeProductDetails();
//       }
//     };
//     window.addEventListener('keydown', handleEsc);
//     return () => window.removeEventListener('keydown', handleEsc);
//   }, []);

//   const getAvailabilityBadge = (product: Product) => {
//     const display = product.availabilityDisplay || {
//       status: 'Unknown',
//       badgeColor: 'gray',
//       icon: '❓',
//       message: 'Availability unknown'
//     };

//     const colorMap = {
//       green: {
//         bg: 'bg-green-500/10',
//         border: 'border-green-500/20',
//         text: 'text-green-400',
//         dot: 'bg-green-500'
//       },
//       blue: {
//         bg: 'bg-blue-500/10',
//         border: 'border-blue-500/20',
//         text: 'text-blue-400',
//         dot: 'bg-blue-500'
//       },
//       red: {
//         bg: 'bg-red-500/10',
//         border: 'border-red-500/20',
//         text: 'text-red-400',
//         dot: 'bg-red-500'
//       },
//       gray: {
//         bg: 'bg-gray-500/10',
//         border: 'border-gray-500/20',
//         text: 'text-gray-400',
//         dot: 'bg-gray-500'
//       }
//     };

//     const colors = colorMap[display.badgeColor as keyof typeof colorMap] || colorMap.gray;

//     return (
//       <span className={`inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold ${colors.text} ${colors.bg} ${colors.border} border px-2.5 py-1 rounded-md`}>
//         <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} ${display.badgeColor === 'green' ? 'animate-pulse' : ''}`}></span>
//         {display.icon} {display.status}
//         {product.isLowStock && (
//           <span className="text-[8px] sm:text-[9px] text-yellow-400 ml-1">Low Stock</span>
//         )}
//       </span>
//     );
//   };

//   return (
//     <main className="min-h-screen bg-[#0b0f14] text-white flex flex-col antialiased font-sans">
      
//       <header className="border-b border-white/10 bg-[#111827] px-4 sm:px-6 py-4 sticky top-0 z-40 shadow-md">
//         <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
//           <div className="flex items-center gap-2 sm:gap-3">
//             <Link href="/shop" className="text-lg sm:text-xl font-black text-orange-500 tracking-wider shrink-0">
//               AUTOGENIUS
//             </Link>
//             <span className="hidden sm:inline-block text-[10px] sm:text-xs bg-white/5 border border-white/10 text-gray-400 px-2.5 py-0.5 rounded-full font-bold">
//               Automotive Parts Hub
//             </span>
//           </div>
          
//           <div className="flex items-center gap-2 sm:gap-3">
//             <Link 
//               href="/dashboard"
//               className="text-[10px] sm:text-xs font-bold bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition flex items-center gap-1 sm:gap-1.5"
//             >
//               <Icons.User />
//               <span className="hidden xs:inline">My Orders</span>
//             </Link>

//             <Link 
//               href="/cart" 
//               className="relative p-2 sm:p-2.5 rounded-xl border border-white/10 bg-[#0b0f14] hover:border-orange-500/30 transition flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-bold"
//             >
//               <Icons.Cart />
//               <span className="hidden xs:inline">My Cart</span>
//               {cartCount > 0 && (
//                 <span className="bg-orange-500 text-white text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-black animate-pulse">
//                   {cartCount}
//                 </span>
//               )}
//             </Link>
//           </div>
//         </div>
//       </header>

//       <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-6 sm:pt-8 md:pt-12 pb-3 sm:pb-4">
//         <div>
//           <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">Genuine Spare Parts Catalog</h1>
//           <p className="text-gray-400 text-[11px] sm:text-xs md:text-sm mt-1">Browse, filter, and access authentic automotive high-grade mechanical components.</p>
//         </div>
        
//         <div className="mt-3 sm:mt-4">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search by chassis number, part name, or description..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl p-2.5 sm:p-3 pl-8 sm:pl-10 outline-none text-sm sm:text-base text-white placeholder-gray-500 focus:border-orange-500 transition"
//             />
//             <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500">
//               <Icons.Search />
//             </div>
//             {searchTerm && (
//               <button
//                 onClick={() => setSearchTerm("")}
//                 className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
//               >
//                 <Icons.Close />
//               </button>
//             )}
//           </div>
//           {searchTerm && (
//             <p className="text-[9px] sm:text-[10px] text-gray-500 mt-1">
//               Found {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "{searchTerm}"
//             </p>
//           )}
//         </div>
        
//         {categories.length > 1 && (
//           <div className="mt-4 sm:mt-6 pb-3 sm:pb-4 border-b border-white/5 overflow-x-auto scrollbar-none flex flex-nowrap gap-1.5 sm:gap-2 -mx-4 px-4 sm:mx-0 sm:px-0">
//             {categories.map((cat) => (
//               <button 
//                 key={cat} 
//                 onClick={() => setSelectedCategory(cat)} 
//                 className={`text-[10px] sm:text-xs font-extrabold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border transition shrink-0 cursor-pointer whitespace-nowrap ${
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

//       <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 pb-12 sm:pb-16 flex-1 flex flex-col justify-start">
//         {loading && (
//           <div className="flex flex-col items-center justify-center py-16 sm:py-24 gap-3 text-gray-400">
//             <Icons.Spinner />
//             <p className="text-[10px] sm:text-xs font-bold tracking-wide uppercase">Syncing Warehouse Index...</p>
//           </div>
//         )}
        
//         {error && (
//           <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 sm:p-4 rounded-xl text-[10px] sm:text-xs font-bold my-4 sm:my-6 flex items-center gap-2 max-w-md mx-auto w-full">
//             <Icons.X />
//             <span>Runtime Failure: {error}</span>
//           </div>
//         )}
        
//         {!loading && !error && (
//           <>
//             {filteredProducts.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-12 sm:py-16 gap-3 sm:gap-4 text-gray-400">
//                 <Icons.Search />
//                 <p className="text-sm sm:text-base font-medium">No products match your search criteria</p>
//                 <p className="text-[10px] sm:text-xs text-gray-500">Try adjusting your search term or category filter</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mt-3 sm:mt-4">
//                 {filteredProducts.map((item) => (
//                   <div key={item._id} className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-200 hover:border-orange-500/30 group">
//                     <div 
//                       className="aspect-square w-full relative bg-[#0b0f14] overflow-hidden cursor-pointer"
//                       onClick={() => openProductDetails(item)}
//                     >
//                       <img 
//                         src={item.imageUrl} 
//                         alt={item.name} 
//                         className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
//                         onError={(e) => {
//                           (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80";
//                         }}
//                       />
//                       <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
//                         <span className="bg-orange-500 text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-lg flex items-center gap-1.5">
//                           <Icons.ViewDetails />
//                           View Details
//                         </span>
//                       </div>
//                       <span className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-[#0b0f14]/90 text-[8px] sm:text-[9px] font-black text-orange-400 border border-orange-500/20 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md uppercase tracking-wider">
//                         {item.category}
//                       </span>
//                       {item.chassisNumber && (
//                         <span className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-[#0b0f14]/90 text-[7px] sm:text-[8px] font-mono text-gray-300 border border-white/10 px-1.5 sm:px-2 py-0.5 rounded-md">
//                           Chassis: {item.chassisNumber}
//                         </span>
//                       )}
//                       <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
//                         {getAvailabilityBadge(item)}
//                       </div>
//                     </div>
                    
//                     <div className="p-2.5 sm:p-3 md:p-4 lg:p-5 flex flex-col justify-between flex-1 gap-2 sm:gap-3">
//                       <div>
//                         <h3 className="font-bold text-xs sm:text-sm md:text-base text-white line-clamp-2">
//                           {item.name}
//                         </h3>
//                         {item.chassisNumber && (
//                           <p className="text-[8px] sm:text-[9px] md:text-[10px] font-mono text-orange-400/80 mt-0.5 sm:mt-1 truncate">
//                             #{item.chassisNumber}
//                           </p>
//                         )}
//                         {item.availabilityDisplay?.message && (
//                           <p className="text-[8px] sm:text-[9px] text-gray-400 mt-0.5 line-clamp-1">
//                             {item.availabilityDisplay.message}
//                           </p>
//                         )}
//                         {item.availabilityStatus === 'INTERNATIONAL_SUPPLIER' && item.supplierName && (
//                           <p className="text-[7px] sm:text-[8px] text-blue-400 mt-0.5 flex items-center gap-1">
//                             <Icons.Globe />
//                             From: {item.supplierName}
//                           </p>
//                         )}
//                         {item.availabilityStatus === 'OUT_OF_STOCK' && item.restockDate && (
//                           <p className="text-[7px] sm:text-[8px] text-gray-500 mt-0.5">
//                             Restock: {new Date(item.restockDate).toLocaleDateString()}
//                           </p>
//                         )}
//                       </div>
//                       <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-white/5 gap-1 sm:gap-2">
//                         <span className="text-xs sm:text-sm md:text-base lg:text-lg font-black text-white whitespace-nowrap">
//                           Ksh {item.price.toLocaleString()}
//                         </span>
//                         {(item.isPurchasable && item.availabilityStatus !== 'OUT_OF_STOCK') ? (
//                           <button 
//                             onClick={() => addToCart(item)} 
//                             className="bg-orange-500 hover:bg-orange-400 text-white text-[10px] sm:text-xs font-extrabold px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl transition shadow-md shadow-orange-500/5 cursor-pointer flex items-center gap-1 sm:gap-1.5 whitespace-nowrap"
//                           >
//                             <Icons.Cart />
//                             <span className="hidden xs:inline">{item.availabilityStatus === 'INTERNATIONAL_SUPPLIER' ? 'Order' : 'Add'}</span>
//                           </button>
//                         ) : (
//                           <button
//                             onClick={() => handleQuoteRequest(item)}
//                             className="bg-green-500/20 hover:bg-green-500/30 text-green-400 text-[9px] sm:text-[10px] md:text-xs font-extrabold px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl transition cursor-pointer flex items-center gap-1 sm:gap-1.5 whitespace-nowrap border border-green-500/20"
//                           >
//                             <Icons.WhatsApp />
//                             <span className="hidden xs:inline">Request Quote</span>
//                             <span className="xs:hidden">Quote</span>
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </>
//         )}
//       </section>

//       {/* PRODUCT DETAILS MODAL */}
//       {isModalOpen && selectedProduct && (
//         <div 
//           className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
//           onClick={closeProductDetails}
//         >
//           <div 
//             className="bg-[#111827] border border-orange-500/20 rounded-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button 
//               onClick={closeProductDetails}
//               className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 p-1.5 sm:p-2 bg-black/50 hover:bg-black/70 rounded-xl text-white transition cursor-pointer"
//             >
//               <Icons.Close />
//             </button>

//             <div className="flex flex-col md:flex-row">
//               <div className="md:w-1/2 bg-[#0b0f14] p-3 sm:p-4 md:p-6 flex items-center justify-center">
//                 <img 
//                   src={selectedProduct.imageUrl} 
//                   alt={selectedProduct.name} 
//                   className="w-full h-auto max-h-[250px] sm:max-h-[300px] md:max-h-[400px] object-contain rounded-xl"
//                   onError={(e) => {
//                     (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80";
//                   }}
//                 />
//               </div>

//               <div className="md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col gap-3 sm:gap-4">
//                 <div className="flex items-center justify-between">
//                   <span className="text-[10px] sm:text-xs font-black text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 sm:px-3 py-1 rounded-md uppercase tracking-wider inline-block">
//                     {selectedProduct.category}
//                   </span>
//                   {getAvailabilityBadge(selectedProduct)}
//                 </div>

//                 <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white">
//                   {selectedProduct.name}
//                 </h2>

//                 {/* Availability Status Sections with SVG Icons */}
//                 {selectedProduct.availabilityStatus === 'IN_STOCK' && (
//                   <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 sm:p-4">
//                     <div className="flex items-center gap-2 sm:gap-3">
//                       <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
//                       <div>
//                         <p className="text-sm sm:text-base font-bold text-green-400">In Stock</p>
//                         <p className="text-[10px] sm:text-xs text-gray-400">
//                           {selectedProduct.quantity} units available • Ready for immediate dispatch
//                         </p>
//                         <p className="text-[10px] sm:text-xs text-gray-400">Estimated delivery: 1-3 business days</p>
//                         {selectedProduct.isLowStock && (
//                           <p className="text-[10px] sm:text-xs text-yellow-400 mt-1">Only {selectedProduct.quantity} units left in stock!</p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {selectedProduct.availabilityStatus === 'INTERNATIONAL_SUPPLIER' && (
//                   <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 sm:p-4">
//                     <div className="flex items-start gap-2 sm:gap-3">
//                       <Icons.Globe />
//                       <div className="flex-1">
//                         <p className="text-sm sm:text-base font-bold text-blue-400">Available from International Supplier</p>
//                         {selectedProduct.supplierName && (
//                           <p className="text-[10px] sm:text-xs text-gray-400">
//                             Supplier: {selectedProduct.supplierName}
//                           </p>
//                         )}
//                         <p className="text-[10px] sm:text-xs text-gray-400">
//                           Delivery: {selectedProduct.supplierDeliveryTime || '10-21 business days'}
//                         </p>
//                         {selectedProduct.supplierShippingCost && selectedProduct.supplierShippingCost > 0 && (
//                           <p className="text-[10px] sm:text-xs text-gray-400">
//                             Shipping: Ksh {selectedProduct.supplierShippingCost.toLocaleString()}
//                           </p>
//                         )}
//                         {selectedProduct.availabilityDisplay?.shippingOptions && selectedProduct.availabilityDisplay.shippingOptions.length > 0 && (
//                           <div className="mt-2">
//                             <p className="text-[9px] sm:text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Shipping Options:</p>
//                             <div className="mt-1 space-y-1">
//                               {selectedProduct.availabilityDisplay.shippingOptions.map((option) => (
//                                 <div key={option.method} className="flex items-center justify-between text-[10px] sm:text-xs">
//                                   <span className="text-gray-300 flex items-center gap-1">
//                                     {option.method === 'air' ? <Icons.Airplane /> : <Icons.Ship />}
//                                     {option.label}
//                                   </span>
//                                   <span className="text-gray-400">
//                                     {option.deliveryTime} {option.cost > 0 ? `• +Ksh ${option.cost.toLocaleString()}` : ''}
//                                   </span>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                         {/* Request Quote button for International Supplier */}
//                         <button
//                           onClick={() => handleQuoteRequest(selectedProduct)}
//                           className="mt-3 text-[10px] sm:text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 font-extrabold px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 border border-green-500/20 w-full justify-center"
//                         >
//                           <Icons.WhatsApp />
//                           Request Quote via WhatsApp
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {selectedProduct.availabilityStatus === 'OUT_OF_STOCK' && (
//                   <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 sm:p-4">
//                     <div className="flex items-start gap-2 sm:gap-3">
//                       <Icons.X />
//                       <div className="flex-1">
//                         <p className="text-sm sm:text-base font-bold text-red-400">Out of Stock</p>
//                         <p className="text-[10px] sm:text-xs text-gray-400">
//                           Currently unavailable for purchase
//                         </p>
//                         {selectedProduct.restockDate && (
//                           <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
//                             Expected restock: {new Date(selectedProduct.restockDate).toLocaleDateString()}
//                           </p>
//                         )}
//                         <button 
//                           className="mt-2 text-[10px] sm:text-xs text-green-400 hover:text-green-300 font-bold transition underline-offset-2 hover:underline flex items-center gap-2"
//                           onClick={() => {
//                             closeProductDetails();
//                             setTimeout(() => handleQuoteRequest(selectedProduct), 300);
//                           }}
//                         >
//                           <Icons.WhatsApp />
//                           Request Quote via WhatsApp
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {selectedProduct.chassisNumber && (
//                   <div className="bg-[#1a1f2e] border border-orange-500/10 rounded-xl p-2.5 sm:p-3">
//                     <p className="text-[9px] sm:text-xs text-gray-400 font-semibold uppercase tracking-wider">Chassis Number</p>
//                     <p className="text-xs sm:text-sm font-mono text-orange-400 font-bold mt-0.5">
//                       {selectedProduct.chassisNumber}
//                     </p>
//                   </div>
//                 )}

//                 {selectedProduct.description && (
//                   <div className="bg-[#1a1f2e] border border-white/5 rounded-xl p-3 sm:p-4">
//                     <p className="text-[9px] sm:text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1 sm:mb-2">Product Description</p>
//                     <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
//                       {selectedProduct.description}
//                     </p>
//                   </div>
//                 )}

//                 <div className="border-t border-white/10 pt-3 sm:pt-4 mt-auto">
//                   <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-3">
//                     <div>
//                       <p className="text-[9px] sm:text-xs text-gray-400 font-semibold uppercase tracking-wider">Price</p>
//                       <p className="text-xl sm:text-2xl font-black text-white">
//                         Ksh {selectedProduct.price.toLocaleString()}
//                       </p>
//                     </div>
//                     {selectedProduct.isPurchasable && selectedProduct.availabilityStatus !== 'OUT_OF_STOCK' ? (
//                       <button 
//                         onClick={() => {
//                           addToCart(selectedProduct);
//                           closeProductDetails();
//                         }}
//                         className="bg-orange-500 hover:bg-orange-400 text-white font-extrabold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition shadow-lg shadow-orange-500/20 cursor-pointer flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm w-full xs:w-auto justify-center"
//                       >
//                         <Icons.Cart />
//                         {selectedProduct.availabilityStatus === 'INTERNATIONAL_SUPPLIER' ? 'Order Now' : 'Add to Cart'}
//                       </button>
//                     ) : (
//                       <button 
//                         onClick={() => {
//                           closeProductDetails();
//                           setTimeout(() => handleQuoteRequest(selectedProduct), 300);
//                         }}
//                         className="bg-green-500/20 hover:bg-green-500/30 text-green-400 font-extrabold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition cursor-pointer flex items-center gap-1.5 sm:gap-2 border border-green-500/20 text-xs sm:text-sm w-full xs:w-auto justify-center"
//                       >
//                         <Icons.WhatsApp />
//                         Request Quote via WhatsApp
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <Footer />
//     </main>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/app/components/Footer";

// SVG Icons
const Icons = {
  WhatsApp: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  Globe: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  Check: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  ),
  X: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Package: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z"/>
      <polyline points="2.32 6.16 12 11 21.68 6.16"/>
      <line x1="12" y1="22.76" x2="12" y2="11"/>
    </svg>
  ),
  Cart: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/>
      <circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  ),
  Search: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Close: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Airplane: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5 10-5"/>
    </svg>
  ),
  Ship: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 21h20"/>
      <path d="M3 14h18"/>
      <path d="M4 10l4-7 4 7"/>
      <path d="M12 3l4 7 4-7"/>
      <path d="M4 14l4 7 4-7"/>
      <path d="M12 14l4 7 4-7"/>
    </svg>
  ),
  User: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Order: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  Spinner: () => (
    <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
    </svg>
  ),
  ViewDetails: () => (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
};

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  chassisNumber?: string | null;
  description?: string;
  imageUrl: string;
  createdAt: string;
  quantity: number;
  supplierAvailable: boolean;
  supplierName?: string;
  supplierDeliveryTime?: string;
  supplierShippingCost?: number;
  shippingOptions?: {
    air?: { enabled: boolean; deliveryTime: string; cost: number; description: string };
    sea?: { enabled: boolean; deliveryTime: string; cost: number; description: string };
  };
  restockDate?: string;
  lowStockThreshold?: number;
  availabilityStatus?: string;
  availabilityDisplay?: {
    status: string;
    badgeColor: string;
    icon: string;
    message: string;
    quantity?: number;
    deliveryEstimate?: string;
    isLowStock?: boolean;
    supplierName?: string;
    shippingCost?: number;
    shippingOptions?: Array<{
      method: string;
      label: string;
      deliveryTime: string;
      cost: number;
      description: string;
    }>;
    restockDate?: string;
    restockMessage?: string;
  };
  isPurchasable?: boolean;
  isLowStock?: boolean;
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

  // Quote Request States
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteProduct, setQuoteProduct] = useState<Product | null>(null);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>("air");
  const [quoteMessage, setQuoteMessage] = useState<string>("");

  const WHATSAPP_NUMBER = "254714200500";

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

  useEffect(() => {
    let result = products;
    
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    
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
    if (!product.isPurchasable) {
      alert("This product is currently not available for purchase.");
      return;
    }

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

  // Open Quote Modal with shipping options
  const openQuoteModal = (product: Product) => {
    setQuoteProduct(product);
    setSelectedShippingMethod("air");
    setQuoteMessage("");
    setShowQuoteModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeQuoteModal = () => {
    setShowQuoteModal(false);
    setQuoteProduct(null);
    document.body.style.overflow = 'unset';
  };

  // Handle quote request with shipping method
  const handleQuoteRequest = () => {
    if (!quoteProduct) return;

    // Get shipping details based on selected method
    let shippingDetails = "";
    if (quoteProduct.shippingOptions) {
      if (selectedShippingMethod === "air" && quoteProduct.shippingOptions.air) {
        shippingDetails = `
Shipping Method: Air Freight (Express)
Delivery Time: ${quoteProduct.shippingOptions.air.deliveryTime || '3-7 business days'}
Shipping Cost: Ksh ${(quoteProduct.shippingOptions.air.cost || 0).toLocaleString()}
Description: ${quoteProduct.shippingOptions.air.description || 'Express shipping by air freight'}`;
      } else if (selectedShippingMethod === "sea" && quoteProduct.shippingOptions.sea) {
        shippingDetails = `
Shipping Method: Sea Freight (Standard)
Delivery Time: ${quoteProduct.shippingOptions.sea.deliveryTime || '20-35 business days'}
Shipping Cost: Ksh ${(quoteProduct.shippingOptions.sea.cost || 0).toLocaleString()}
Description: ${quoteProduct.shippingOptions.sea.description || 'Standard shipping by sea freight'}`;
      }
    }

    const message = `
Hello Auto Genius Team,

I would like to request a quote for the following product:

Product: ${quoteProduct.name}
Category: ${quoteProduct.category}
Price: Ksh ${quoteProduct.price.toLocaleString()}
Chassis Number: ${quoteProduct.chassisNumber || 'N/A'}
Description: ${quoteProduct.description || 'No description available'}
Status: ${quoteProduct.availabilityStatus === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Available from International Supplier'}
${shippingDetails}
${quoteMessage ? `Additional Message: ${quoteMessage}` : ''}

I would like to know:
1. Availability and lead time
2. Total cost including shipping
3. Any additional charges

Please get back to me with a quotation.

Thank you!`.trim();

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    closeQuoteModal();
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeProductDetails();
        closeQuoteModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const getAvailabilityBadge = (product: Product) => {
    const display = product.availabilityDisplay || {
      status: 'Unknown',
      badgeColor: 'gray',
      icon: '❓',
      message: 'Availability unknown'
    };

    const colorMap = {
      green: {
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
        text: 'text-green-400',
        dot: 'bg-green-500'
      },
      blue: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        text: 'text-blue-400',
        dot: 'bg-blue-500'
      },
      red: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        text: 'text-red-400',
        dot: 'bg-red-500'
      },
      gray: {
        bg: 'bg-gray-500/10',
        border: 'border-gray-500/20',
        text: 'text-gray-400',
        dot: 'bg-gray-500'
      }
    };

    const colors = colorMap[display.badgeColor as keyof typeof colorMap] || colorMap.gray;

    return (
      <span className={`inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold ${colors.text} ${colors.bg} ${colors.border} border px-2.5 py-1 rounded-md`}>
        <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} ${display.badgeColor === 'green' ? 'animate-pulse' : ''}`}></span>
        {display.icon} {display.status}
        {product.isLowStock && (
          <span className="text-[8px] sm:text-[9px] text-yellow-400 ml-1">Low Stock</span>
        )}
      </span>
    );
  };

  // Helper function to get shipping options for the quote modal
  const getShippingOptions = () => {
    if (!quoteProduct?.shippingOptions) return [];
    
    const options = [];
    if (quoteProduct.shippingOptions.air?.enabled !== false) {
      options.push({
        value: 'air',
        label: 'Air Freight (Express)',
        icon: <Icons.Airplane />,
        deliveryTime: quoteProduct.shippingOptions.air?.deliveryTime || '3-7 business days',
        cost: quoteProduct.shippingOptions.air?.cost || 0
      });
    }
    if (quoteProduct.shippingOptions.sea?.enabled !== false) {
      options.push({
        value: 'sea',
        label: 'Sea Freight (Standard)',
        icon: <Icons.Ship />,
        deliveryTime: quoteProduct.shippingOptions.sea?.deliveryTime || '20-35 business days',
        cost: quoteProduct.shippingOptions.sea?.cost || 0
      });
    }
    return options;
  };

  // Check if product should show quote button instead of add to cart
  const shouldShowQuoteButton = (product: Product) => {
    return !product.isPurchasable || product.availabilityStatus === 'INTERNATIONAL_SUPPLIER';
  };

  return (
    <main className="min-h-screen bg-[#0b0f14] text-white flex flex-col antialiased font-sans">
      
      <header className="border-b border-white/10 bg-[#111827] px-4 sm:px-6 py-4 sticky top-0 z-40 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/shop" className="text-lg sm:text-xl font-black text-orange-500 tracking-wider shrink-0">
              AUTOGENIUS
            </Link>
            <span className="hidden sm:inline-block text-[10px] sm:text-xs bg-white/5 border border-white/10 text-gray-400 px-2.5 py-0.5 rounded-full font-bold">
              Automotive Parts Hub
            </span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <Link 
              href="/dashboard"
              className="text-[10px] sm:text-xs font-bold bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition flex items-center gap-1 sm:gap-1.5"
            >
              <Icons.User />
              <span className="hidden xs:inline">My Orders</span>
            </Link>

            <Link 
              href="/cart" 
              className="relative p-2 sm:p-2.5 rounded-xl border border-white/10 bg-[#0b0f14] hover:border-orange-500/30 transition flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-bold"
            >
              <Icons.Cart />
              <span className="hidden xs:inline">My Cart</span>
              {cartCount > 0 && (
                <span className="bg-orange-500 text-white text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-black animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-6 sm:pt-8 md:pt-12 pb-3 sm:pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">Genuine Spare Parts Catalog</h1>
          <p className="text-gray-400 text-[11px] sm:text-xs md:text-sm mt-1">Browse, filter, and access authentic automotive high-grade mechanical components.</p>
        </div>
        
        <div className="mt-3 sm:mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by chassis number, part name, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl p-2.5 sm:p-3 pl-8 sm:pl-10 outline-none text-sm sm:text-base text-white placeholder-gray-500 focus:border-orange-500 transition"
            />
            <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Icons.Search />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
              >
                <Icons.Close />
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-[9px] sm:text-[10px] text-gray-500 mt-1">
              Found {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "{searchTerm}"
            </p>
          )}
        </div>
        
        {categories.length > 1 && (
          <div className="mt-4 sm:mt-6 pb-3 sm:pb-4 border-b border-white/5 overflow-x-auto scrollbar-none flex flex-nowrap gap-1.5 sm:gap-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)} 
                className={`text-[10px] sm:text-xs font-extrabold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border transition shrink-0 cursor-pointer whitespace-nowrap ${
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

      <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 pb-12 sm:pb-16 flex-1 flex flex-col justify-start">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 gap-3 text-gray-400">
            <Icons.Spinner />
            <p className="text-[10px] sm:text-xs font-bold tracking-wide uppercase">Syncing Warehouse Index...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 sm:p-4 rounded-xl text-[10px] sm:text-xs font-bold my-4 sm:my-6 flex items-center gap-2 max-w-md mx-auto w-full">
            <Icons.X />
            <span>Runtime Failure: {error}</span>
          </div>
        )}
        
        {!loading && !error && (
          <>
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 sm:py-16 gap-3 sm:gap-4 text-gray-400">
                <Icons.Search />
                <p className="text-sm sm:text-base font-medium">No products match your search criteria</p>
                <p className="text-[10px] sm:text-xs text-gray-500">Try adjusting your search term or category filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mt-3 sm:mt-4">
                {filteredProducts.map((item) => (
                  <div key={item._id} className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-200 hover:border-orange-500/30 group">
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
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="bg-orange-500 text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-lg flex items-center gap-1.5">
                          <Icons.ViewDetails />
                          View Details
                        </span>
                      </div>
                      <span className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-[#0b0f14]/90 text-[8px] sm:text-[9px] font-black text-orange-400 border border-orange-500/20 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md uppercase tracking-wider">
                        {item.category}
                      </span>
                      {item.chassisNumber && (
                        <span className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-[#0b0f14]/90 text-[7px] sm:text-[8px] font-mono text-gray-300 border border-white/10 px-1.5 sm:px-2 py-0.5 rounded-md">
                          Chassis: {item.chassisNumber}
                        </span>
                      )}
                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                        {getAvailabilityBadge(item)}
                      </div>
                    </div>
                    
                    <div className="p-2.5 sm:p-3 md:p-4 lg:p-5 flex flex-col justify-between flex-1 gap-2 sm:gap-3">
                      <div>
                        <h3 className="font-bold text-xs sm:text-sm md:text-base text-white line-clamp-2">
                          {item.name}
                        </h3>
                        {item.chassisNumber && (
                          <p className="text-[8px] sm:text-[9px] md:text-[10px] font-mono text-orange-400/80 mt-0.5 sm:mt-1 truncate">
                            #{item.chassisNumber}
                          </p>
                        )}
                        {item.availabilityDisplay?.message && (
                          <p className="text-[8px] sm:text-[9px] text-gray-400 mt-0.5 line-clamp-1">
                            {item.availabilityDisplay.message}
                          </p>
                        )}
                        {item.availabilityStatus === 'INTERNATIONAL_SUPPLIER' && item.supplierName && (
                          <p className="text-[7px] sm:text-[8px] text-blue-400 mt-0.5 flex items-center gap-1">
                            <Icons.Globe />
                            From: {item.supplierName}
                          </p>
                        )}
                        {item.availabilityStatus === 'OUT_OF_STOCK' && item.restockDate && (
                          <p className="text-[7px] sm:text-[8px] text-gray-500 mt-0.5">
                            Restock: {new Date(item.restockDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-white/5 gap-1 sm:gap-2">
                        <span className="text-xs sm:text-sm md:text-base lg:text-lg font-black text-white whitespace-nowrap">
                          Ksh {item.price.toLocaleString()}
                        </span>
                        {shouldShowQuoteButton(item) ? (
                          <button
                            onClick={() => openQuoteModal(item)}
                            className="bg-green-500/20 hover:bg-green-500/30 text-green-400 text-[9px] sm:text-[10px] md:text-xs font-extrabold px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl transition cursor-pointer flex items-center gap-1 sm:gap-1.5 whitespace-nowrap border border-green-500/20"
                          >
                            <Icons.WhatsApp />
                            <span className="hidden xs:inline">Request Quote</span>
                            <span className="xs:hidden">Quote</span>
                          </button>
                        ) : (
                          <button 
                            onClick={() => addToCart(item)} 
                            className="bg-orange-500 hover:bg-orange-400 text-white text-[10px] sm:text-xs font-extrabold px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl transition shadow-md shadow-orange-500/5 cursor-pointer flex items-center gap-1 sm:gap-1.5 whitespace-nowrap"
                          >
                            <Icons.Cart />
                            <span className="hidden xs:inline">Add</span>
                          </button>
                        )}
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
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeProductDetails}
        >
          <div 
            className="bg-[#111827] border border-orange-500/20 rounded-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeProductDetails}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 p-1.5 sm:p-2 bg-black/50 hover:bg-black/70 rounded-xl text-white transition cursor-pointer"
            >
              <Icons.Close />
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 bg-[#0b0f14] p-3 sm:p-4 md:p-6 flex items-center justify-center">
                <img 
                  src={selectedProduct.imageUrl} 
                  alt={selectedProduct.name} 
                  className="w-full h-auto max-h-[250px] sm:max-h-[300px] md:max-h-[400px] object-contain rounded-xl"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80";
                  }}
                />
              </div>

              <div className="md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col gap-3 sm:gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-black text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 sm:px-3 py-1 rounded-md uppercase tracking-wider inline-block">
                    {selectedProduct.category}
                  </span>
                  {getAvailabilityBadge(selectedProduct)}
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white">
                  {selectedProduct.name}
                </h2>

                {/* Availability Status Sections */}
                {selectedProduct.availabilityStatus === 'IN_STOCK' && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                      <div>
                        <p className="text-sm sm:text-base font-bold text-green-400">In Stock</p>
                        <p className="text-[10px] sm:text-xs text-gray-400">
                          {selectedProduct.quantity} units available • Ready for immediate dispatch
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-400">Estimated delivery: 1-3 business days</p>
                        {selectedProduct.isLowStock && (
                          <p className="text-[10px] sm:text-xs text-yellow-400 mt-1">Only {selectedProduct.quantity} units left in stock!</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {selectedProduct.availabilityStatus === 'INTERNATIONAL_SUPPLIER' && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Icons.Globe />
                      <div className="flex-1">
                        <p className="text-sm sm:text-base font-bold text-blue-400">Available from International Supplier</p>
                        {selectedProduct.supplierName && (
                          <p className="text-[10px] sm:text-xs text-gray-400">
                            Supplier: {selectedProduct.supplierName}
                          </p>
                        )}
                        <p className="text-[10px] sm:text-xs text-gray-400">
                          Delivery: {selectedProduct.supplierDeliveryTime || '10-21 business days'}
                        </p>
                        {selectedProduct.supplierShippingCost && selectedProduct.supplierShippingCost > 0 && (
                          <p className="text-[10px] sm:text-xs text-gray-400">
                            Shipping: Ksh {selectedProduct.supplierShippingCost.toLocaleString()}
                          </p>
                        )}
                        {selectedProduct.availabilityDisplay?.shippingOptions && selectedProduct.availabilityDisplay.shippingOptions.length > 0 && (
                          <div className="mt-2">
                            <p className="text-[9px] sm:text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Shipping Options:</p>
                            <div className="mt-1 space-y-1">
                              {selectedProduct.availabilityDisplay.shippingOptions.map((option) => (
                                <div key={option.method} className="flex items-center justify-between text-[10px] sm:text-xs">
                                  <span className="text-gray-300 flex items-center gap-1">
                                    {option.method === 'air' ? <Icons.Airplane /> : <Icons.Ship />}
                                    {option.label}
                                  </span>
                                  <span className="text-gray-400">
                                    {option.deliveryTime} {option.cost > 0 ? `• +Ksh ${option.cost.toLocaleString()}` : ''}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* Request Quote button for International Supplier */}
                        <button
                          onClick={() => openQuoteModal(selectedProduct)}
                          className="mt-3 text-[10px] sm:text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 font-extrabold px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 border border-green-500/20 w-full justify-center"
                        >
                          <Icons.WhatsApp />
                          Request Quote via WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedProduct.availabilityStatus === 'OUT_OF_STOCK' && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Icons.X />
                      <div className="flex-1">
                        <p className="text-sm sm:text-base font-bold text-red-400">Out of Stock</p>
                        <p className="text-[10px] sm:text-xs text-gray-400">
                          Currently unavailable for purchase
                        </p>
                        {selectedProduct.restockDate && (
                          <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                            Expected restock: {new Date(selectedProduct.restockDate).toLocaleDateString()}
                          </p>
                        )}
                        <button 
                          className="mt-2 text-[10px] sm:text-xs text-green-400 hover:text-green-300 font-bold transition underline-offset-2 hover:underline flex items-center gap-2"
                          onClick={() => {
                            closeProductDetails();
                            setTimeout(() => openQuoteModal(selectedProduct), 300);
                          }}
                        >
                          <Icons.WhatsApp />
                          Request Quote via WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedProduct.chassisNumber && (
                  <div className="bg-[#1a1f2e] border border-orange-500/10 rounded-xl p-2.5 sm:p-3">
                    <p className="text-[9px] sm:text-xs text-gray-400 font-semibold uppercase tracking-wider">Chassis Number</p>
                    <p className="text-xs sm:text-sm font-mono text-orange-400 font-bold mt-0.5">
                      {selectedProduct.chassisNumber}
                    </p>
                  </div>
                )}

                {selectedProduct.description && (
                  <div className="bg-[#1a1f2e] border border-white/5 rounded-xl p-3 sm:p-4">
                    <p className="text-[9px] sm:text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1 sm:mb-2">Product Description</p>
                    <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>
                )}

                <div className="border-t border-white/10 pt-3 sm:pt-4 mt-auto">
                  <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-3">
                    <div>
                      <p className="text-[9px] sm:text-xs text-gray-400 font-semibold uppercase tracking-wider">Price</p>
                      <p className="text-xl sm:text-2xl font-black text-white">
                        Ksh {selectedProduct.price.toLocaleString()}
                      </p>
                    </div>
                    {shouldShowQuoteButton(selectedProduct) ? (
                      <button 
                        onClick={() => {
                          closeProductDetails();
                          setTimeout(() => openQuoteModal(selectedProduct), 300);
                        }}
                        className="bg-green-500/20 hover:bg-green-500/30 text-green-400 font-extrabold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition cursor-pointer flex items-center gap-1.5 sm:gap-2 border border-green-500/20 text-xs sm:text-sm w-full xs:w-auto justify-center"
                      >
                        <Icons.WhatsApp />
                        Request Quote via WhatsApp
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          addToCart(selectedProduct);
                          closeProductDetails();
                        }}
                        className="bg-orange-500 hover:bg-orange-400 text-white font-extrabold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition shadow-lg shadow-orange-500/20 cursor-pointer flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm w-full xs:w-auto justify-center"
                      >
                        <Icons.Cart />
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUOTE MODAL WITH SHIPPING OPTIONS */}
      {showQuoteModal && quoteProduct && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={closeQuoteModal}
        >
          <div 
            className="bg-[#111827] border border-orange-500/20 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-white">Request Quote</h2>
              <button onClick={closeQuoteModal} className="text-gray-400 hover:text-white transition">
                <Icons.Close />
              </button>
            </div>

            <div className="bg-[#1a1f2e] border border-white/10 rounded-xl p-3 mb-4">
              <p className="text-sm font-bold text-white">{quoteProduct.name}</p>
              <p className="text-xs text-gray-400">
                {quoteProduct.availabilityStatus === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Available from International Supplier'}
              </p>
            </div>

            {/* Shipping Method Selection */}
            {getShippingOptions().length > 0 && (
              <div className="mb-4">
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2 tracking-wider">
                  Preferred Shipping Method
                </label>
                <div className="space-y-2">
                  {getShippingOptions().map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedShippingMethod(option.value)}
                      className={`w-full p-3 rounded-xl border transition flex items-center justify-between ${
                        selectedShippingMethod === option.value
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                          : 'border-white/10 bg-[#0b0f14] text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {option.icon}
                        <span className="text-sm font-bold">{option.label}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500">{option.deliveryTime}</span>
                        {option.cost > 0 && (
                          <span className="text-xs text-gray-500 block">+Ksh {option.cost.toLocaleString()}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Message */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2 tracking-wider">
                Additional Message (Optional)
              </label>
              <textarea
                placeholder="Any specific requirements or questions..."
                value={quoteMessage}
                onChange={(e) => setQuoteMessage(e.target.value)}
                className="w-full bg-[#0b0f14] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-orange-500 transition outline-none min-h-[80px] resize-y"
              />
            </div>

            <button
              onClick={handleQuoteRequest}
              className="w-full bg-green-500 hover:bg-green-400 text-white font-extrabold py-3.5 rounded-xl text-sm transition flex items-center justify-center gap-2"
            >
              <Icons.WhatsApp />
              Send Quote Request on WhatsApp
            </button>

            <p className="text-[10px] text-gray-500 text-center mt-3">
              You will be redirected to WhatsApp to send your request
            </p>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}