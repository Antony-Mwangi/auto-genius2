

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// interface ProductForm {
//   id?: string;
//   name: string;
//   price: string;
//   category: string;
//   imageFile: File | null;
// }

// interface DBProduct {
//   _id: string;
//   name: string;
//   price: number;
//   category: string;
//   imageUrl: string;
// }

// type OrderStatus = "Pending" | "Processed" | "Dispatched" | "Delivered";

// interface OrderNotification {
//   id: string;
//   mongoId: string;
//   customerName: string;
//   phone: string;
//   paymentMethod: string;
//   items: string;
//   total: number;
//   time: string;
//   status: OrderStatus;
// }

// export default function AdminDashboardPage() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   // 1. PRODUCT & INVENTORY MANAGEMENT STATES
//   const [dbProducts, setDbProducts] = useState<DBProduct[]>([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [product, setProduct] = useState<ProductForm>({
//     name: "",
//     price: "",
//     category: "",
//     imageFile: null,
//   });
//   const [productLoading, setProductLoading] = useState(false);
//   const [productMessage, setProductMessage] = useState<{ text: string; isError: boolean } | null>(null);

//   // 2. LIVE ORDER STATES & TICKETING
//   const [orders, setOrders] = useState<OrderNotification[]>([]);
//   const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

//   const fetchInventory = async () => {
//     try {
//       const res = await fetch("/api/products");
//       if (res.ok) {
//         const data = await res.json();
//         setDbProducts(data);
//       }
//     } catch (err) {
//       console.error("Failed to sync client inventory view", err);
//     }
//   };

//   const fetchLiveOrders = async () => {
//     try {
//       const res = await fetch("/api/orders");
//       if (res.ok) {
//         const data = await res.json();
//         const formatted: OrderNotification[] = data.map((o: any) => ({
//           id: o._id.substring(o._id.length - 6).toUpperCase(),
//           mongoId: o._id,
//           customerName: o.customerName,
//           phone: o.phone,
//           paymentMethod: o.paymentMethod || "Cash on Delivery",
//           items: o.itemsSummary,
//           total: o.total,
//           time: new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " (" + new Date(o.createdAt).toLocaleDateString() + ")",
//           status: o.status || "Pending"
//         }));
//         setOrders(formatted);
//       }
//     } catch (err) {
//       console.error("Live order background sync failed:", err);
//     }
//   };

//   useEffect(() => {
//     fetchInventory();
//     fetchLiveOrders();

//     const syncInterval = setInterval(fetchLiveOrders, 8000);
//     return () => clearInterval(syncInterval);
//   }, []);

//   const getOrderCounts = () => {
//     return {
//       pending: orders.filter(o => o.status === "Pending").length,
//       processed: orders.filter(o => o.status === "Processed").length,
//       dispatched: orders.filter(o => o.status === "Dispatched").length,
//       delivered: orders.filter(o => o.status === "Delivered").length,
//     };
//   };

//   const counts = getOrderCounts();

//   const handleLogout = async () => {
//     try {
//       const res = await fetch("/api/admin/logout", { method: "POST" });
//       if (res.ok) {
//         router.push("/admin/login");
//         router.refresh();
//         setTimeout(() => { window.location.href = "/admin/login"; }, 100);
//       }
//     } catch (err) {
//       console.error("Logout failed:", err);
//     }
//   };

//   const startEditMode = (item: DBProduct) => {
//     setIsEditing(true);
//     setProduct({
//       id: item._id,
//       name: item.name,
//       price: item.price.toString(),
//       category: item.category,
//       imageFile: null,
//     });
//     setProductMessage(null);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const cancelEditMode = () => {
//     setIsEditing(false);
//     setProduct({ name: "", price: "", category: "", imageFile: null });
//     setProductMessage(null);
//     const fileInput = document.getElementById("file-upload-input") as HTMLInputElement;
//     if (fileInput) fileInput.value = "";
//   };

//   const handleProductSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!isEditing && !product.imageFile) {
//       setProductMessage({ text: "Please select an asset image file to upload.", isError: true });
//       return;
//     }

//     setProductLoading(true);
//     setProductMessage(null);

//     const data = new FormData();
//     data.append("name", product.name);
//     data.append("price", product.price);
//     data.append("category", product.category);
//     if (product.id) data.append("id", product.id);
//     if (product.imageFile) data.append("image", product.imageFile);

//     try {
//       const targetMethod = isEditing ? "PUT" : "POST";
//       const res = await fetch("/api/products", { method: targetMethod, body: data });
//       const result = await res.json();

//       if (res.ok) {
//         setProductMessage({ text: isEditing ? "Spare part modified successfully!" : "Spare part cataloged successfully!", isError: false });
//         cancelEditMode();
//         fetchInventory();
//       } else {
//         setProductMessage({ text: result.message || "Failed to catalog part.", isError: true });
//       }
//     } catch (err) {
//       setProductMessage({ text: "Data sync network error.", isError: true });
//     } finally {
//       setProductLoading(false);
//     }
//   };

//   const handleProductDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this spare part item permanently?")) return;

//     try {
//       const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
//       const result = await res.json();

//       if (res.ok) {
//         setProductMessage({ text: "Product removed from index.", isError: false });
//         fetchInventory();
//         if (product.id === id) cancelEditMode();
//       } else {
//         setProductMessage({ text: result.message || "Failed to delete item.", isError: true });
//       }
//     } catch (err) {
//       setProductMessage({ text: "Network communication error during deletion.", isError: true });
//     }
//   };

//   const updateOrderStatus = async (orderId: string, mongoId: string, newStatus: OrderStatus) => {
//     if (updatingOrderId) return;
    
//     setUpdatingOrderId(orderId);
//     try {
//       const res = await fetch("/api/orders", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id: mongoId, status: newStatus }),
//       });

//       if (res.ok) {
//         setOrders(prev => prev.map(o => 
//           o.id === orderId ? { ...o, status: newStatus } : o
//         ));
//       } else {
//         const errorData = await res.json();
//         alert(`Failed to update status: ${errorData.message || "Unknown error"}`);
//       }
//     } catch (err) {
//       console.error("Order update failure:", err);
//       alert("Network error while updating order status.");
//     } finally {
//       setUpdatingOrderId(null);
//     }
//   };

//   const getStatusBadgeConfig = (status: OrderStatus) => {
//     const configs = {
//       Pending: { bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-400", dot: "bg-orange-500" },
//       Processed: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", dot: "bg-blue-500" },
//       Dispatched: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400", dot: "bg-purple-500" },
//       Delivered: { bg: "bg-green-500/10", border: "border-green-500/20", text: "text-green-400", dot: "bg-green-500" },
//     };
//     return configs[status];
//   };

//   const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
//     const flow: OrderStatus[] = ["Pending", "Processed", "Dispatched", "Delivered"];
//     const currentIndex = flow.indexOf(currentStatus);
//     return currentIndex < flow.length - 1 ? flow[currentIndex + 1] : null;
//   };

//   const getStatusProgress = (status: OrderStatus): number => {
//     const flow: OrderStatus[] = ["Pending", "Processed", "Dispatched", "Delivered"];
//     const index = flow.indexOf(status);
//     return ((index + 1) / flow.length) * 100;
//   };

//   return (
//     <main className="min-h-screen bg-[#0b0f14] text-white flex flex-col md:flex-row antialiased font-sans">
      
//       {/* MOBILE HEADER RESPONSIVE TOGGLE */}
//       <header className="w-full bg-[#111827] border-b border-white/10 p-4 flex items-center justify-between md:hidden shrink-0 z-50 sticky top-0">
//         <div>
//           <span className="text-lg font-black text-orange-500 tracking-wider">AUTOGENIUS</span>
//           <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Admin Terminal</span>
//         </div>
//         <button 
//           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
//           className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 focus:text-white transition"
//           aria-label="Toggle navigation menu"
//         >
//           {isMobileMenuOpen ? (
//             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
//             </svg>
//           ) : (
//             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
//             </svg>
//           )}
//         </button>
//       </header>

//       {/* SIDEBAR NAVIGATION HUB */}
//       <aside className={`w-full md:w-64 bg-[#111827] border-r border-white/10 flex flex-col justify-between shrink-0 
//         ${isMobileMenuOpen ? "fixed top-[61px] inset-x-0 bottom-0 z-40 block bg-[#111827]" : "hidden md:flex"} 
//         transition-all duration-300 md:sticky md:top-0 md:h-screen`}
//       >
//         <div className="flex flex-col h-full justify-between">
//           <div>
//             <div className="p-6 border-b border-white/10 hidden md:block">
//               <span className="text-xl font-black text-orange-500 tracking-wider block">AUTOGENIUS</span>
//               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admin Terminal</span>
//             </div>
            
//             <nav className="p-4 space-y-2">
//               <button 
//                 onClick={() => { setActiveTab("products"); setIsMobileMenuOpen(false); }} 
//                 className={`w-full text-left p-3.5 rounded-xl font-semibold text-sm transition flex items-center gap-3 cursor-pointer ${activeTab === "products" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/10" : "text-gray-400 hover:bg-white/5"}`}
//               >
//                 <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.777c-.293.228-.425.621-.347.983.008.037.017.075.023.113.03.177.03.358 0 .535-.006.038-.015.076-.023.113-.078.362.054.755.347.983l1.003.777a1.125 1.125 0 0 1 .26 1.43l-1.296 2.247a1.125 1.125 0 0 1-1.37.49l-1.216-.456a1.125 1.125 0 0 0-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281a1.125 1.125 0 0 0-.646-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.777c.292-.228.424-.621.346-.983a6.525 6.525 0 0 1-.022-.113a5.27 5.27 0 0 1 0-.535c.007-.038.016-.076.022-.113.078-.362-.054-.755-.346-.983L4.316 9.74a1.125 1.125 0 0 1-.26-1.43L5.353 6.06a1.125 1.125 0 0 1 1.369-.49l1.217.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128c.332-.183.582-.495.646-.869L9.593 3.94Z" />
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
//                 </svg>
//                 <span>Spare Parts Hub</span>
//               </button>
              
//               <button 
//                 onClick={() => { setActiveTab("orders"); setIsMobileMenuOpen(false); }} 
//                 className={`w-full text-left p-3.5 rounded-xl font-semibold text-sm transition flex items-center justify-between cursor-pointer ${activeTab === "orders" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/10" : "text-gray-400 hover:bg-white/5"}`}
//               >
//                 <span className="flex items-center gap-3">
//                   <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
//                   </svg>
//                   <span>Live Orders</span>
//                   {counts.pending > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />}
//                 </span>
//                 {counts.pending > 0 && <span className="bg-red-500 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">{counts.pending}</span>}
//               </button>
//             </nav>
//           </div>
          
//           <div className="p-4 border-t border-white/10 space-y-3 bg-[#111827]">
//             <Link href="/shop" className="text-center text-xs text-gray-300 hover:text-white transition py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl font-bold flex items-center justify-center gap-2 w-full">
//               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
//               </svg>
//               Open Storefront
//             </Link>
//             <button onClick={handleLogout} className="w-full bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2">
//               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
//               </svg>
//               Disconnect Terminal
//             </button>
//           </div>
//         </div>
//       </aside>

//       {/* WORKSPACE AREA */}
//       <section className="flex-1 p-4 sm:p-6 md:p-10 max-w-5xl mx-auto w-full overflow-hidden">
        
//         {/* ==================== MODULE 1: INVENTORY MANAGEMENT ==================== */}
//         {activeTab === "products" && (
//           <div className="space-y-6 sm:space-y-10">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4 sm:pb-6">
//               <div>
//                 <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{isEditing ? "Modify Catalog Item" : "Catalog Spare Parts"}</h1>
//                 <p className="text-gray-400 text-xs sm:text-sm mt-1">Manage, update, and deploy components directly into the storefront database index.</p>
//               </div>
//               {isEditing && (
//                 <button onClick={cancelEditMode} className="bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 self-start sm:self-center">
//                   <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
//                   </svg>
//                   Cancel Edit
//                 </button>
//               )}
//             </div>

//             {productMessage && (
//               <div className={`p-4 rounded-xl text-sm font-semibold border ${productMessage.isError ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-green-500/10 border-green-500/30 text-green-400"}`}>
//                 {productMessage.text}
//               </div>
//             )}

//             {/* PRODUCT INPUT FORM */}
         
// {/* PRODUCT INPUT FORM */}
// <form onSubmit={handleProductSubmit} className="bg-[#111827] border border-orange-500/10 rounded-2xl p-5 sm:p-8 space-y-5 shadow-xl relative">
//   {isEditing && <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500 rounded-t-2xl" />}
  
//   <div>
//     <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Part Name / Model</label>
//     <input 
//       type="text" 
//       required 
//       placeholder="e.g., Toyota Hilux Brake Pads (Front)" 
//       value={product.name} 
//       onChange={e => setProduct(prev => ({ ...prev, name: e.target.value }))} 
//       className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl p-3 outline-none text-sm font-bold text-white placeholder-gray-500 focus:border-orange-500 transition" 
//     />
//   </div>

//   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//     <div>
//       <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Retail Price (Ksh)</label>
//       <input 
//         type="number" 
//         required 
//         placeholder="4500" 
//         value={product.price} 
//         onChange={e => setProduct(prev => ({ ...prev, price: e.target.value }))} 
//         className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl p-3 outline-none text-sm font-bold text-white placeholder-gray-500 focus:border-orange-500 transition" 
//       />
//     </div>
//     <div>
//       <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Category Assignment</label>
//       <select
//         required
//         value={product.category}
//         onChange={e => setProduct(prev => ({ ...prev, category: e.target.value }))}
//         className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl p-3 outline-none text-sm font-bold text-white placeholder-gray-500 focus:border-orange-500 transition appearance-none cursor-pointer"
//       >
//         <option value="" className="text-gray-400">Select a category...</option>
//         <option value="Brakes" className="text-white">Brakes</option>
//         <option value="Engine" className="text-white">Engine</option>
//         <option value="Suspension" className="text-white">Suspension</option>
//       </select>
//     </div>
//   </div>

//   <div>
//     <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">{isEditing ? "Replace Reference Image (Optional)" : "Part Asset Reference Image"}</label>
//     <input 
//       id="file-upload-input" 
//       type="file" 
//       required={!isEditing} 
//       accept="image/*" 
//       onChange={e => setProduct(prev => ({ ...prev, imageFile: e.target.files?.[0] || null }))} 
//       className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange-500/10 file:text-orange-400 hover:file:bg-orange-500 hover:file:text-white p-2 border border-dashed border-white/10 rounded-xl bg-[#0b0f14] cursor-pointer transition" 
//     />
//   </div>

//   <button type="submit" disabled={productLoading} className="w-full bg-orange-500 hover:bg-orange-400 text-white font-extrabold py-3.5 rounded-xl text-sm transition disabled:opacity-50 shadow-lg cursor-pointer">
//     {productLoading ? "Syncing Operations..." : isEditing ? "Save Configuration Changes" : "Publish to Storefront"}
//   </button>
// </form>
//             {/* LIVE INVENTORY DATA CONTENT DISPLAY */}
//             <div className="space-y-4 pt-2">
//               <h2 className="text-xl font-extrabold tracking-tight text-white">Active Inventory Catalog ({dbProducts.length})</h2>
              
//               {/* DESKTOP VIEW MAPPED TO TABLE */}
//               <div className="hidden sm:block bg-[#111827] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-left border-collapse text-sm">
//                     <thead>
//                       <tr className="border-b border-white/10 bg-white/5 text-gray-400 text-xs font-bold uppercase tracking-wider">
//                         <th className="p-4">Asset Image</th>
//                         <th className="p-4">Part Details</th>
//                         <th className="p-4">Category</th>
//                         <th className="p-4">Price</th>
//                         <th className="p-4 text-right">Actions Matrix</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-white/5 font-medium">
//                       {dbProducts.length > 0 ? (
//                         dbProducts.map(item => (
//                           <tr key={item._id} className="hover:bg-white/5 transition group">
//                             <td className="p-4 w-20">
//                               <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded-lg border border-white/10 bg-[#0b0f14]" onError={e => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=100&q=80"; }} />
//                             </td>
//                             <td className="p-4 max-w-xs font-bold text-white truncate">{item.name}</td>
//                             <td className="p-4"><span className="text-xs bg-white/5 text-orange-400 border border-white/10 px-2.5 py-0.5 rounded-md font-bold">{item.category}</span></td>
//                             <td className="p-4 font-black text-white">Ksh {item.price.toLocaleString()}</td>
//                             <td className="p-4 text-right space-x-2 whitespace-nowrap">
//                               <button onClick={() => startEditMode(item)} className="text-xs font-bold px-3 py-1.5 rounded-lg border border-orange-500/20 bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-white transition cursor-pointer inline-flex items-center gap-1">
//                                 <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
//                                   <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
//                                 </svg>
//                                 Edit
//                               </button>
//                               <button onClick={() => handleProductDelete(item._id)} className="text-xs font-bold px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer inline-flex items-center gap-1">
//                                 <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
//                                   <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
//                                 </svg>
//                                 Delete
//                               </button>
//                             </td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr><td colSpan={5} className="p-8 text-center text-gray-400">No registered physical components sitting inside the live MongoDB database cluster.</td></tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               {/* MOBILE VIEW GRID RESPONSIVE CARDS */}
//               <div className="grid grid-cols-1 gap-4 sm:hidden">
//                 {dbProducts.length > 0 ? (
//                   dbProducts.map(item => (
//                     <div key={item._id} className="bg-[#111827] border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-md">
//                       <div className="flex gap-3 items-center">
//                         <img src={item.imageUrl} alt={item.name} className="w-14 h-14 object-cover rounded-xl border border-white/10 bg-[#0b0f14]" onError={e => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=100&q=80"; }} />
//                         <div className="min-w-0 flex-1">
//                           <h4 className="font-bold text-white text-sm line-clamp-2">{item.name}</h4>
//                           <span className="inline-block text-[10px] bg-white/5 text-orange-400 border border-white/10 px-2 py-0.5 rounded-md mt-1 font-bold">{item.category}</span>
//                         </div>
//                       </div>
//                       <div className="flex justify-between items-center border-t border-white/5 pt-3">
//                         <span className="text-sm font-black text-white">Ksh {item.price.toLocaleString()}</span>
//                         <div className="flex gap-2">
//                           <button onClick={() => startEditMode(item)} className="text-xs font-bold px-3 py-2 rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400 transition cursor-pointer flex items-center gap-1">
//                             <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
//                             </svg>
//                             Edit
//                           </button>
//                           <button onClick={() => handleProductDelete(item._id)} className="text-xs font-bold px-3 py-2 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 transition cursor-pointer flex items-center gap-1">
//                             <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
//                             </svg>
//                             Delete
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="text-center py-12 bg-[#111827] border border-white/10 rounded-2xl text-gray-400 text-xs">
//                     No components sitting inside the cluster.
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ==================== MODULE 2: ORDER NOTIFICATION FEED ==================== */}
//         {activeTab === "orders" && (
//           <div className="space-y-6">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4 sm:pb-6">
//               <div>
//                 <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Live Dispatch Tickets</h1>
//                 <p className="text-gray-400 text-xs sm:text-sm mt-1">Real-time incoming client checkout store metrics with full lifecycle tracking.</p>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black px-2.5 py-1 rounded-full">Pending: {counts.pending}</span>
//                 <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black px-2.5 py-1 rounded-full">Processed: {counts.processed}</span>
//                 <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black px-2.5 py-1 rounded-full">Dispatched: {counts.dispatched}</span>
//                 <span className="bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black px-2.5 py-1 rounded-full">Delivered: {counts.delivered}</span>
//               </div>
//             </div>
            
//             <div className="space-y-4">
//               {orders.length > 0 ? (
//                 orders.map(order => {
//                   const statusConfig = getStatusBadgeConfig(order.status);
//                   const nextStatus = getNextStatus(order.status);
//                   const progress = getStatusProgress(order.status);
//                   const isUpdating = updatingOrderId === order.id;

//                   return (
//                     <div key={order.id} className={`border rounded-2xl p-4 sm:p-5 shadow-xl transition flex flex-col gap-4 relative overflow-hidden ${order.status === "Pending" ? "bg-[#1f1d1a] border-orange-500/30" : "bg-[#111827] border-white/10"}`}>
//                       {order.status === "Pending" && <div className="absolute top-0 left-0 bottom-0 w-1 bg-orange-500" />}
                      
//                       <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
//                         <div className="space-y-2 flex-1 w-full">
//                           <div className="flex flex-wrap items-center gap-2">
//                             <span className="font-mono text-[10px] sm:text-[11px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">#{order.id}</span>
//                             <h3 className="font-bold text-sm sm:text-base text-white">{order.customerName}</h3>
//                             <span className="text-[11px] text-gray-400 font-medium">• {order.time}</span>
                            
//                             <span className={`text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
//                               order.paymentMethod === "M-Pesa" 
//                                 ? "bg-green-500/10 border border-green-500/20 text-green-400" 
//                                 : "bg-blue-500/10 border border-blue-500/20 text-blue-400"
//                             }`}>
//                               {order.paymentMethod === "M-Pesa" ? "M-Pesa" : "COD"}
//                             </span>
//                           </div>
                          
//                           <p className="text-xs sm:text-sm text-gray-300 font-medium">Bought: <span className="text-white font-bold">{order.items}</span></p>
                          
//                           <div className="flex flex-col sm:flex-row sm:gap-6 gap-1 text-xs text-gray-400 pt-1 border-t border-white/5 sm:border-0 sm:pt-0">
//                             <p>Phone: <span className="text-gray-200 font-mono font-bold">{order.phone}</span></p>
//                             <p>Total: <span className="text-orange-400 font-black">Ksh {order.total.toLocaleString()}</span></p>
//                           </div>
//                         </div>
                        
//                         <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row items-center gap-3 border-t border-white/5 pt-3 md:border-0 md:pt-0">
//                           {/* Status Badge with Progress Indicator */}
//                           <div className="w-full md:w-auto">
//                             <div className={`flex items-center gap-2 ${statusConfig.bg} ${statusConfig.border} border px-3 py-2 rounded-xl`}>
//                               <span className={`w-2 h-2 rounded-full ${statusConfig.dot} animate-pulse`} />
//                               <span className={`text-xs font-bold ${statusConfig.text}`}>{order.status}</span>
//                               <span className="text-[10px] text-gray-500 font-mono">({Math.round(progress)}%)</span>
//                             </div>
//                             {/* Progress bar */}
//                             <div className="w-full mt-1.5 h-1 bg-white/5 rounded-full overflow-hidden">
//                               <div 
//                                 className={`h-full transition-all duration-500 ${
//                                   order.status === "Delivered" ? "bg-green-500" :
//                                   order.status === "Dispatched" ? "bg-purple-500" :
//                                   order.status === "Processed" ? "bg-blue-500" : "bg-orange-500"
//                                 }`}
//                                 style={{ width: `${progress}%` }}
//                               />
//                             </div>
//                           </div>

//                           {/* Action Buttons */}
//                           <div className="flex gap-2 w-full md:w-auto">
//                             {nextStatus && (
//                               <button 
//                                 onClick={() => updateOrderStatus(order.id, order.mongoId, nextStatus)} 
//                                 disabled={isUpdating}
//                                 className="flex-1 md:flex-none bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
//                               >
//                                 {isUpdating ? (
//                                   <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
//                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                                   </svg>
//                                 ) : (
//                                   <>
//                                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
//                                       <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125a1.125 1.125 0 0 0 1.125-1.125V9.75M8.25 4.5h8.25a2.25 2.25 0 0 1 2.25 2.25v7.5m-15 0h15m-15 0v-7.5A2.25 2.25 0 0 1 5.25 4.5h3" />
//                                     </svg>
//                                     Mark {nextStatus}
//                                   </>
//                                 )}
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       </div>

//                       {/* Status Flow Indicators */}
//                       <div className="flex items-center gap-2 pt-2 border-t border-white/5">
//                         {["Pending", "Processed", "Dispatched", "Delivered"].map((stage, index) => {
//                           const isCompleted = order.status === stage;
//                           const isPast = getStatusProgress(order.status) > ((index + 1) / 4) * 100;
//                           const statusColors = {
//                             Pending: "text-orange-400",
//                             Processed: "text-blue-400",
//                             Dispatched: "text-purple-400",
//                             Delivered: "text-green-400"
//                           };
                          
//                           return (
//                             <div key={stage} className="flex items-center gap-1.5">
//                               <div className={`flex items-center gap-1.5 ${isCompleted || isPast ? statusColors[stage as OrderStatus] : "text-gray-600"}`}>
//                                 <span className={`w-1.5 h-1.5 rounded-full ${isCompleted || isPast ? "bg-current" : "bg-gray-600"}`} />
//                                 <span className={`text-[9px] font-bold ${isCompleted || isPast ? "opacity-100" : "opacity-40"}`}>
//                                   {stage}
//                                 </span>
//                               </div>
//                               {index < 3 && (
//                                 <span className={`text-[8px] ${isPast ? "text-gray-500" : "text-gray-700"}`}>→</span>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   );
//                 })
//               ) : (
//                 <div className="text-center py-16 bg-[#111827] border border-white/10 rounded-2xl text-gray-400 text-sm font-medium">
//                   No order checkout entries registered inside the database ledger.
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProductForm {
  id?: string;
  name: string;
  price: string;
  category: string;
  chassisNumber: string;
  description: string;
  imageFile: File | null;
}

interface DBProduct {
  _id: string;
  name: string;
  price: number;
  category: string;
  chassisNumber: string;
  description: string;
  imageUrl: string;
}

type OrderStatus = "Pending" | "Processed" | "Dispatched" | "Delivered";

interface OrderNotification {
  id: string;
  mongoId: string;
  customerName: string;
  phone: string;
  paymentMethod: string;
  items: string;
  total: number;
  time: string;
  status: OrderStatus;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 1. PRODUCT & INVENTORY MANAGEMENT STATES
  const [dbProducts, setDbProducts] = useState<DBProduct[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [product, setProduct] = useState<ProductForm>({
    name: "",
    price: "",
    category: "",
    chassisNumber: "",
    description: "",
    imageFile: null,
  });
  const [productLoading, setProductLoading] = useState(false);
  const [productMessage, setProductMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // 2. LIVE ORDER STATES & TICKETING
  const [orders, setOrders] = useState<OrderNotification[]>([]);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setDbProducts(data);
      }
    } catch (err) {
      console.error("Failed to sync client inventory view", err);
    }
  };

  const fetchLiveOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        const formatted: OrderNotification[] = data.map((o: any) => ({
          id: o._id.substring(o._id.length - 6).toUpperCase(),
          mongoId: o._id,
          customerName: o.customerName,
          phone: o.phone,
          paymentMethod: o.paymentMethod || "Cash on Delivery",
          items: o.itemsSummary,
          total: o.total,
          time: new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " (" + new Date(o.createdAt).toLocaleDateString() + ")",
          status: o.status || "Pending"
        }));
        setOrders(formatted);
      }
    } catch (err) {
      console.error("Live order background sync failed:", err);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchLiveOrders();

    const syncInterval = setInterval(fetchLiveOrders, 8000);
    return () => clearInterval(syncInterval);
  }, []);

  const getOrderCounts = () => {
    return {
      pending: orders.filter(o => o.status === "Pending").length,
      processed: orders.filter(o => o.status === "Processed").length,
      dispatched: orders.filter(o => o.status === "Dispatched").length,
      delivered: orders.filter(o => o.status === "Delivered").length,
    };
  };

  const counts = getOrderCounts();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) {
        router.push("/admin/login");
        router.refresh();
        setTimeout(() => { window.location.href = "/admin/login"; }, 100);
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const startEditMode = (item: DBProduct) => {
    setIsEditing(true);
    setProduct({
      id: item._id,
      name: item.name,
      price: item.price.toString(),
      category: item.category,
      chassisNumber: item.chassisNumber || "",
      description: item.description || "",
      imageFile: null,
    });
    setProductMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditMode = () => {
    setIsEditing(false);
    setProduct({ 
      name: "", 
      price: "", 
      category: "", 
      chassisNumber: "",
      description: "",
      imageFile: null 
    });
    setProductMessage(null);
    const fileInput = document.getElementById("file-upload-input") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing && !product.imageFile) {
      setProductMessage({ text: "Please select an asset image file to upload.", isError: true });
      return;
    }

    if (!product.chassisNumber.trim()) {
      setProductMessage({ text: "Chassis number is required.", isError: true });
      return;
    }

    setProductLoading(true);
    setProductMessage(null);

    const data = new FormData();
    data.append("name", product.name);
    data.append("price", product.price);
    data.append("category", product.category);
    data.append("chassisNumber", product.chassisNumber.trim());
    data.append("description", product.description.trim());
    if (product.id) data.append("id", product.id);
    if (product.imageFile) data.append("image", product.imageFile);

    try {
      const targetMethod = isEditing ? "PUT" : "POST";
      const res = await fetch("/api/products", { method: targetMethod, body: data });
      const result = await res.json();

      if (res.ok) {
        setProductMessage({ text: isEditing ? "Spare part modified successfully!" : "Spare part cataloged successfully!", isError: false });
        cancelEditMode();
        fetchInventory();
      } else {
        setProductMessage({ text: result.message || "Failed to catalog part.", isError: true });
      }
    } catch (err) {
      setProductMessage({ text: "Data sync network error.", isError: true });
    } finally {
      setProductLoading(false);
    }
  };

  const handleProductDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this spare part item permanently?")) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      const result = await res.json();

      if (res.ok) {
        setProductMessage({ text: "Product removed from index.", isError: false });
        fetchInventory();
        if (product.id === id) cancelEditMode();
      } else {
        setProductMessage({ text: result.message || "Failed to delete item.", isError: true });
      }
    } catch (err) {
      setProductMessage({ text: "Network communication error during deletion.", isError: true });
    }
  };

  const updateOrderStatus = async (orderId: string, mongoId: string, newStatus: OrderStatus) => {
    if (updatingOrderId) return;
    
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: mongoId, status: newStatus }),
      });

      if (res.ok) {
        setOrders(prev => prev.map(o => 
          o.id === orderId ? { ...o, status: newStatus } : o
        ));
      } else {
        const errorData = await res.json();
        alert(`Failed to update status: ${errorData.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Order update failure:", err);
      alert("Network error while updating order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusBadgeConfig = (status: OrderStatus) => {
    const configs = {
      Pending: { bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-400", dot: "bg-orange-500" },
      Processed: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", dot: "bg-blue-500" },
      Dispatched: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400", dot: "bg-purple-500" },
      Delivered: { bg: "bg-green-500/10", border: "border-green-500/20", text: "text-green-400", dot: "bg-green-500" },
    };
    return configs[status];
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const flow: OrderStatus[] = ["Pending", "Processed", "Dispatched", "Delivered"];
    const currentIndex = flow.indexOf(currentStatus);
    return currentIndex < flow.length - 1 ? flow[currentIndex + 1] : null;
  };

  const getStatusProgress = (status: OrderStatus): number => {
    const flow: OrderStatus[] = ["Pending", "Processed", "Dispatched", "Delivered"];
    const index = flow.indexOf(status);
    return ((index + 1) / flow.length) * 100;
  };

  return (
    <main className="min-h-screen bg-[#0b0f14] text-white flex flex-col md:flex-row antialiased font-sans">
      
      {/* MOBILE HEADER RESPONSIVE TOGGLE */}
      <header className="w-full bg-[#111827] border-b border-white/10 p-4 flex items-center justify-between md:hidden shrink-0 z-50 sticky top-0">
        <div>
          <span className="text-lg font-black text-orange-500 tracking-wider">AUTOGENIUS</span>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Admin Terminal</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 focus:text-white transition"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </header>

      {/* SIDEBAR NAVIGATION HUB */}
      <aside className={`w-full md:w-64 bg-[#111827] border-r border-white/10 flex flex-col justify-between shrink-0 
        ${isMobileMenuOpen ? "fixed top-[61px] inset-x-0 bottom-0 z-40 block bg-[#111827]" : "hidden md:flex"} 
        transition-all duration-300 md:sticky md:top-0 md:h-screen`}
      >
        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="p-6 border-b border-white/10 hidden md:block">
              <span className="text-xl font-black text-orange-500 tracking-wider block">AUTOGENIUS</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admin Terminal</span>
            </div>
            
            <nav className="p-4 space-y-2">
              <button 
                onClick={() => { setActiveTab("products"); setIsMobileMenuOpen(false); }} 
                className={`w-full text-left p-3.5 rounded-xl font-semibold text-sm transition flex items-center gap-3 cursor-pointer ${activeTab === "products" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/10" : "text-gray-400 hover:bg-white/5"}`}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.777c-.293.228-.425.621-.347.983.008.037.017.075.023.113.03.177.03.358 0 .535-.006.038-.015.076-.023.113-.078.362.054.755.347.983l1.003.777a1.125 1.125 0 0 1 .26 1.43l-1.296 2.247a1.125 1.125 0 0 1-1.37.49l-1.216-.456a1.125 1.125 0 0 0-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281a1.125 1.125 0 0 0-.646-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.777c.292-.228.424-.621.346-.983a6.525 6.525 0 0 1-.022-.113a5.27 5.27 0 0 1 0-.535c.007-.038.016-.076.022-.113.078-.362-.054-.755-.346-.983L4.316 9.74a1.125 1.125 0 0 1-.26-1.43L5.353 6.06a1.125 1.125 0 0 1 1.369-.49l1.217.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128c.332-.183.582-.495.646-.869L9.593 3.94Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <span>Spare Parts Hub</span>
              </button>
              
              <button 
                onClick={() => { setActiveTab("orders"); setIsMobileMenuOpen(false); }} 
                className={`w-full text-left p-3.5 rounded-xl font-semibold text-sm transition flex items-center justify-between cursor-pointer ${activeTab === "orders" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/10" : "text-gray-400 hover:bg-white/5"}`}
              >
                <span className="flex items-center gap-3">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                  </svg>
                  <span>Live Orders</span>
                  {counts.pending > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />}
                </span>
                {counts.pending > 0 && <span className="bg-red-500 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">{counts.pending}</span>}
              </button>
            </nav>
          </div>
          
          <div className="p-4 border-t border-white/10 space-y-3 bg-[#111827]">
            <Link href="/shop" className="text-center text-xs text-gray-300 hover:text-white transition py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl font-bold flex items-center justify-center gap-2 w-full">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              Open Storefront
            </Link>
            <button onClick={handleLogout} className="w-full bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
              Disconnect Terminal
            </button>
          </div>
        </div>
      </aside>

      {/* WORKSPACE AREA */}
      <section className="flex-1 p-4 sm:p-6 md:p-10 max-w-5xl mx-auto w-full overflow-hidden">
        
        {/* ==================== MODULE 1: INVENTORY MANAGEMENT ==================== */}
        {activeTab === "products" && (
          <div className="space-y-6 sm:space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4 sm:pb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{isEditing ? "Modify Catalog Item" : "Catalog Spare Parts"}</h1>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">Manage, update, and deploy components directly into the storefront database index.</p>
              </div>
              {isEditing && (
                <button onClick={cancelEditMode} className="bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 self-start sm:self-center">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                  Cancel Edit
                </button>
              )}
            </div>

            {productMessage && (
              <div className={`p-4 rounded-xl text-sm font-semibold border ${productMessage.isError ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-green-500/10 border-green-500/30 text-green-400"}`}>
                {productMessage.text}
              </div>
            )}

            {/* PRODUCT INPUT FORM */}
            <form onSubmit={handleProductSubmit} className="bg-[#111827] border border-orange-500/10 rounded-2xl p-5 sm:p-8 space-y-5 shadow-xl relative">
              {isEditing && <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500 rounded-t-2xl" />}
              
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Part Name / Model</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g., Toyota Hilux Brake Pads (Front)" 
                  value={product.name} 
                  onChange={e => setProduct(prev => ({ ...prev, name: e.target.value }))} 
                  className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl p-3 outline-none text-sm font-bold text-white placeholder-gray-500 focus:border-orange-500 transition" 
                />
              </div>

              {/* Chassis Number - New Field */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Chassis Number <span className="text-orange-400">*</span></label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g., JTEBU17F780123456" 
                  value={product.chassisNumber} 
                  onChange={e => setProduct(prev => ({ ...prev, chassisNumber: e.target.value }))} 
                  className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl p-3 outline-none text-sm font-bold text-white placeholder-gray-500 focus:border-orange-500 transition font-mono" 
                />
                <p className="text-[10px] text-gray-500 mt-1">Unique identifier for customer searches</p>
              </div>

              {/* Description - New Field */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Product Description</label>
                <textarea 
                  placeholder="e.g., High-quality ceramic brake pads with excellent stopping power" 
                  value={product.description} 
                  onChange={e => setProduct(prev => ({ ...prev, description: e.target.value }))} 
                  className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl p-3 outline-none text-sm font-bold text-white placeholder-gray-500 focus:border-orange-500 transition min-h-[80px] resize-y" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Retail Price (Ksh)</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="4500" 
                    value={product.price} 
                    onChange={e => setProduct(prev => ({ ...prev, price: e.target.value }))} 
                    className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl p-3 outline-none text-sm font-bold text-white placeholder-gray-500 focus:border-orange-500 transition" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Category Assignment</label>
                  <select
                    required
                    value={product.category}
                    onChange={e => setProduct(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-[#1a1f2e] border border-white/10 rounded-xl p-3 outline-none text-sm font-bold text-white placeholder-gray-500 focus:border-orange-500 transition appearance-none cursor-pointer"
                  >
                    <option value="" className="text-gray-400">Select a category...</option>
                    <option value="Brakes" className="text-white">Brakes</option>
                    <option value="Engine" className="text-white">Engine</option>
                    <option value="Suspension" className="text-white">Suspension</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">{isEditing ? "Replace Reference Image (Optional)" : "Part Asset Reference Image"}</label>
                <input 
                  id="file-upload-input" 
                  type="file" 
                  required={!isEditing} 
                  accept="image/*" 
                  onChange={e => setProduct(prev => ({ ...prev, imageFile: e.target.files?.[0] || null }))} 
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange-500/10 file:text-orange-400 hover:file:bg-orange-500 hover:file:text-white p-2 border border-dashed border-white/10 rounded-xl bg-[#0b0f14] cursor-pointer transition" 
                />
              </div>

              <button type="submit" disabled={productLoading} className="w-full bg-orange-500 hover:bg-orange-400 text-white font-extrabold py-3.5 rounded-xl text-sm transition disabled:opacity-50 shadow-lg cursor-pointer">
                {productLoading ? "Syncing Operations..." : isEditing ? "Save Configuration Changes" : "Publish to Storefront"}
              </button>
            </form>

            {/* LIVE INVENTORY DATA CONTENT DISPLAY */}
            <div className="space-y-4 pt-2">
              <h2 className="text-xl font-extrabold tracking-tight text-white">Active Inventory Catalog ({dbProducts.length})</h2>
              
              {/* DESKTOP VIEW MAPPED TO TABLE */}
              <div className="hidden sm:block bg-[#111827] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5 text-gray-400 text-xs font-bold uppercase tracking-wider">
                        <th className="p-4">Asset Image</th>
                        <th className="p-4">Part Details</th>
                        <th className="p-4">Chassis</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4 text-right">Actions Matrix</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium">
                      {dbProducts.length > 0 ? (
                        dbProducts.map(item => (
                          <tr key={item._id} className="hover:bg-white/5 transition group">
                            <td className="p-4 w-20">
                              <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded-lg border border-white/10 bg-[#0b0f14]" onError={e => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=100&q=80"; }} />
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-white text-sm">{item.name}</div>
                              {item.description && (
                                <div className="text-gray-400 text-xs mt-0.5 line-clamp-1">{item.description}</div>
                              )}
                            </td>
                            <td className="p-4">
                              <span className="text-xs font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-1 rounded-md font-bold">
                                {item.chassisNumber}
                              </span>
                            </td>
                            <td className="p-4"><span className="text-xs bg-white/5 text-orange-400 border border-white/10 px-2.5 py-0.5 rounded-md font-bold">{item.category}</span></td>
                            <td className="p-4 font-black text-white">Ksh {item.price.toLocaleString()}</td>
                            <td className="p-4 text-right space-x-2 whitespace-nowrap">
                              <button onClick={() => startEditMode(item)} className="text-xs font-bold px-3 py-1.5 rounded-lg border border-orange-500/20 bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-white transition cursor-pointer inline-flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                </svg>
                                Edit
                              </button>
                              <button onClick={() => handleProductDelete(item._id)} className="text-xs font-bold px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer inline-flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={6} className="p-8 text-center text-gray-400">No registered physical components sitting inside the live MongoDB database cluster.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MOBILE VIEW GRID RESPONSIVE CARDS */}
              <div className="grid grid-cols-1 gap-4 sm:hidden">
                {dbProducts.length > 0 ? (
                  dbProducts.map(item => (
                    <div key={item._id} className="bg-[#111827] border border-white/10 rounded-2xl p-4 flex flex-col gap-3 shadow-md">
                      <div className="flex gap-3 items-center">
                        <img src={item.imageUrl} alt={item.name} className="w-14 h-14 object-cover rounded-xl border border-white/10 bg-[#0b0f14]" onError={e => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=100&q=80"; }} />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-white text-sm line-clamp-2">{item.name}</h4>
                          <span className="text-[10px] font-mono text-orange-400 block truncate">#{item.chassisNumber}</span>
                          {item.description && (
                            <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{item.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 border-t border-white/5 pt-3">
                        <span className="text-xs bg-white/5 text-orange-400 border border-white/10 px-2 py-0.5 rounded-md font-bold">{item.category}</span>
                        <span className="text-sm font-black text-white ml-auto">Ksh {item.price.toLocaleString()}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => startEditMode(item)} className="flex-1 text-xs font-bold px-3 py-2 rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400 transition cursor-pointer flex items-center justify-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                          </svg>
                          Edit
                        </button>
                        <button onClick={() => handleProductDelete(item._id)} className="flex-1 text-xs font-bold px-3 py-2 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 transition cursor-pointer flex items-center justify-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-[#111827] border border-white/10 rounded-2xl text-gray-400 text-xs">
                    No components sitting inside the cluster.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== MODULE 2: ORDER NOTIFICATION FEED ==================== */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4 sm:pb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Live Dispatch Tickets</h1>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">Real-time incoming client checkout store metrics with full lifecycle tracking.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black px-2.5 py-1 rounded-full">Pending: {counts.pending}</span>
                <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black px-2.5 py-1 rounded-full">Processed: {counts.processed}</span>
                <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black px-2.5 py-1 rounded-full">Dispatched: {counts.dispatched}</span>
                <span className="bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black px-2.5 py-1 rounded-full">Delivered: {counts.delivered}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map(order => {
                  const statusConfig = getStatusBadgeConfig(order.status);
                  const nextStatus = getNextStatus(order.status);
                  const progress = getStatusProgress(order.status);
                  const isUpdating = updatingOrderId === order.id;

                  return (
                    <div key={order.id} className={`border rounded-2xl p-4 sm:p-5 shadow-xl transition flex flex-col gap-4 relative overflow-hidden ${order.status === "Pending" ? "bg-[#1f1d1a] border-orange-500/30" : "bg-[#111827] border-white/10"}`}>
                      {order.status === "Pending" && <div className="absolute top-0 left-0 bottom-0 w-1 bg-orange-500" />}
                      
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-2 flex-1 w-full">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-[10px] sm:text-[11px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">#{order.id}</span>
                            <h3 className="font-bold text-sm sm:text-base text-white">{order.customerName}</h3>
                            <span className="text-[11px] text-gray-400 font-medium">• {order.time}</span>
                            
                            <span className={`text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                              order.paymentMethod === "M-Pesa" 
                                ? "bg-green-500/10 border border-green-500/20 text-green-400" 
                                : "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                            }`}>
                              {order.paymentMethod === "M-Pesa" ? "M-Pesa" : "COD"}
                            </span>
                          </div>
                          
                          <p className="text-xs sm:text-sm text-gray-300 font-medium">Bought: <span className="text-white font-bold">{order.items}</span></p>
                          
                          <div className="flex flex-col sm:flex-row sm:gap-6 gap-1 text-xs text-gray-400 pt-1 border-t border-white/5 sm:border-0 sm:pt-0">
                            <p>Phone: <span className="text-gray-200 font-mono font-bold">{order.phone}</span></p>
                            <p>Total: <span className="text-orange-400 font-black">Ksh {order.total.toLocaleString()}</span></p>
                          </div>
                        </div>
                        
                        <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row items-center gap-3 border-t border-white/5 pt-3 md:border-0 md:pt-0">
                          {/* Status Badge with Progress Indicator */}
                          <div className="w-full md:w-auto">
                            <div className={`flex items-center gap-2 ${statusConfig.bg} ${statusConfig.border} border px-3 py-2 rounded-xl`}>
                              <span className={`w-2 h-2 rounded-full ${statusConfig.dot} animate-pulse`} />
                              <span className={`text-xs font-bold ${statusConfig.text}`}>{order.status}</span>
                              <span className="text-[10px] text-gray-500 font-mono">({Math.round(progress)}%)</span>
                            </div>
                            {/* Progress bar */}
                            <div className="w-full mt-1.5 h-1 bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-500 ${
                                  order.status === "Delivered" ? "bg-green-500" :
                                  order.status === "Dispatched" ? "bg-purple-500" :
                                  order.status === "Processed" ? "bg-blue-500" : "bg-orange-500"
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 w-full md:w-auto">
                            {nextStatus && (
                              <button 
                                onClick={() => updateOrderStatus(order.id, order.mongoId, nextStatus)} 
                                disabled={isUpdating}
                                className="flex-1 md:flex-none bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                              >
                                {isUpdating ? (
                                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                ) : (
                                  <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125a1.125 1.125 0 0 0 1.125-1.125V9.75M8.25 4.5h8.25a2.25 2.25 0 0 1 2.25 2.25v7.5m-15 0h15m-15 0v-7.5A2.25 2.25 0 0 1 5.25 4.5h3" />
                                    </svg>
                                    Mark {nextStatus}
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status Flow Indicators */}
                      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                        {["Pending", "Processed", "Dispatched", "Delivered"].map((stage, index) => {
                          const isCompleted = order.status === stage;
                          const isPast = getStatusProgress(order.status) > ((index + 1) / 4) * 100;
                          const statusColors = {
                            Pending: "text-orange-400",
                            Processed: "text-blue-400",
                            Dispatched: "text-purple-400",
                            Delivered: "text-green-400"
                          };
                          
                          return (
                            <div key={stage} className="flex items-center gap-1.5">
                              <div className={`flex items-center gap-1.5 ${isCompleted || isPast ? statusColors[stage as OrderStatus] : "text-gray-600"}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isCompleted || isPast ? "bg-current" : "bg-gray-600"}`} />
                                <span className={`text-[9px] font-bold ${isCompleted || isPast ? "opacity-100" : "opacity-40"}`}>
                                  {stage}
                                </span>
                              </div>
                              {index < 3 && (
                                <span className={`text-[8px] ${isPast ? "text-gray-500" : "text-gray-700"}`}>→</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-16 bg-[#111827] border border-white/10 rounded-2xl text-gray-400 text-sm font-medium">
                  No order checkout entries registered inside the database ledger.
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}