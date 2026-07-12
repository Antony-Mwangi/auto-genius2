// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { User, Mail, ShieldCheck, ArrowRight, Settings, LogOut } from "lucide-react";
// import Navbar from "@/app/components/Navbar";
// import Footer from "@/app/components/Footer";

// export default function CustomerDashboardPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState({ name: "Valued Customer", email: "" });

//   useEffect(() => {
//     // Prevent state updates if component unmounts
//     let isMounted = true;

//     async function fetchProfile() {
//       try {
//         const res = await fetch("/api/auth/me");
//         if (res.status === 401) {
//           router.push("/login");
//           return;
//         }
//         const data = await res.json();
//         if (isMounted && data?.user) {
//           setUser({ name: data.user.fullName, email: data.user.email });
//         }
//       } catch (err) {
//         console.error("Profile fetch error:", err);
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     }

//     fetchProfile();
//     return () => { isMounted = false; };
//   }, [router]);

//   const handleLogout = async () => {
//     try {
//       const res = await fetch("/api/auth/logout", { method: "POST" });
      
//       if (res.ok) {
//         // 1. Clear local state immediately
//         setUser({ name: "", email: "" });
        
//         // 2. Force Next.js to refresh server components/cookies
//         router.refresh(); 
        
//         // 3. Redirect to login
//         router.replace("/login"); 
//       }
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-[#0b0f14] text-white flex flex-col font-sans overflow-x-hidden">
//       <Navbar />

//       <section className="flex-grow w-full max-w-5xl mx-auto px-4 py-8 md:px-6 md:py-12 space-y-8">
        
//         {/* HEADER */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-extrabold text-white">Welcome, {user.name}</h1>
//             <p className="text-gray-400 text-sm mt-1">Manage your account and settings.</p>
//           </div>
//           <button 
//             onClick={handleLogout}
//             className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors w-full sm:w-auto"
//           >
//             <LogOut size={18} /> Sign Out
//           </button>
//         </div>

//         {/* INFO CARDS */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div className="bg-[#111827] border border-white/10 p-5 rounded-2xl flex items-center gap-4">
//             <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 shrink-0"><User size={22} /></div>
//             <div className="min-w-0">
//               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Name</p>
//               <p className="font-bold truncate">{user.name}</p>
//             </div>
//           </div>

//           <div className="bg-[#111827] border border-white/10 p-5 rounded-2xl flex items-center gap-4">
//             <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 shrink-0"><Mail size={22} /></div>
//             <div className="min-w-0">
//               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</p>
//               <p className="font-bold truncate text-sm md:text-base font-mono">{user.email}</p>
//             </div>
//           </div>
//         </div>

//         {/* QUICK ACTIONS */}
//         <div className="space-y-4">
//           <h2 className="text-lg font-bold">Quick Actions</h2>
//           <div className="grid grid-cols-1 gap-4">
            
//             <a href="/shop" className="bg-[#111827] border border-white/10 p-5 rounded-2xl hover:border-orange-500/50 transition flex items-center justify-between group">
//               <span className="font-bold flex items-center gap-3">
//                 <Settings size={20} className="text-orange-500" /> Browse Spare Parts
//               </span>
//               <ArrowRight size={20} className="text-gray-600 group-hover:text-white transition-colors" />
//             </a>
            
//             <button className="bg-[#111827] border border-white/10 p-5 rounded-2xl hover:border-green-500/50 transition flex items-center justify-between group text-left">
//               <span className="font-bold flex items-center gap-3">
//                 <ShieldCheck size={20} className="text-green-500" /> Security Settings
//               </span>
//               <ArrowRight size={20} className="text-gray-600 group-hover:text-white transition-colors" />
//             </button>

//           </div>
//         </div>
//       </section>

//       <Footer />
//     </main>
//   );
// }



"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  ArrowRight,
  Settings,
  LogOut,
  Package,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Info,
  CreditCard,
  Phone,
  Calendar,
  Hash,
  Shield,
  Eye,
  Home,
  HelpCircle,
} from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

type OrderStatus = "Pending" | "Processed" | "Dispatched" | "Delivered";

interface Order {
  _id: string;
  user: string | null;
  customerName: string;
  customerEmail: string;
  phone: string;
  paymentMethod: string;
  itemsSummary: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: "customer" | "admin";
}

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [securityAlert, setSecurityAlert] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile>({
    id: "",
    fullName: "Valued Customer",
    email: "",
    role: "customer",
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [verifiedOrdersCount, setVerifiedOrdersCount] = useState(0);

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const data = await res.json();
      if (data?.user) {
        setUser({
          id: data.user.id || data.user._id || "",
          fullName: data.user.fullName || "Valued Customer",
          email: data.user.email || "",
          role: data.user.role || "customer",
        });
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError("Failed to load profile. Please refresh the page.");
    }
  }, [router]);

  // Fetch orders with security verification
  const fetchOrders = useCallback(async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    }

    try {
      const res = await fetch("/api/orders", {
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch orders");
      }

      const data = await res.json();
      const ordersArray = Array.isArray(data) ? data : [];

      const userEmail = user.email.toLowerCase();
      const verifiedOrders = ordersArray.filter((order: Order) => {
        if (user.role === "admin") return true;
        const belongsToUser =
          order.user === user.id ||
          order.customerEmail?.toLowerCase() === userEmail;

        if (!belongsToUser) {
          console.warn(`⚠️ Security: Order ${order._id} does not belong to user ${userEmail}`);
          setSecurityAlert(`Found an order that doesn't belong to you. This has been blocked.`);
        }

        return belongsToUser;
      });

      if (verifiedOrders.length < ordersArray.length) {
        const blockedCount = ordersArray.length - verifiedOrders.length;
        console.error(`🚨 SECURITY: Blocked ${blockedCount} orders from showing to user ${userEmail}`);
        setSecurityAlert(`⚠️ Security alert: ${blockedCount} order(s) were blocked from your view.`);
      }

      setOrders(verifiedOrders);
      setVerifiedOrdersCount(verifiedOrders.length);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error("Orders fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to load your orders");
    } finally {
      setOrdersLoading(false);
      if (showRefresh) {
        setRefreshing(false);
      }
    }
  }, [router, user.id, user.email, user.role]);

  // Initial load
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      await fetchProfile();
      if (isMounted) {
        await fetchOrders();
        setLoading(false);
      }
    };

    loadData();

    const interval = setInterval(() => {
      if (isMounted && !refreshing) {
        fetchOrders(false);
      }
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [fetchProfile, fetchOrders, refreshing]);

  const handleRefresh = async () => {
    await fetchOrders(true);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setUser({ id: "", fullName: "", email: "", role: "customer" });
        setOrders([]);
        router.refresh();
        router.replace("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setError("Failed to logout. Please try again.");
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getStatusConfig = (status: OrderStatus) => {
    const configs = {
      Pending: {
        icon: Clock,
        color: "text-orange-400",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20",
        label: "Pending",
        description: "Your order is being reviewed and processed.",
        progressColor: "bg-orange-500",
      },
      Processed: {
        icon: AlertCircle,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        label: "Processed",
        description: "Your order has been confirmed and is being prepared.",
        progressColor: "bg-blue-500",
      },
      Dispatched: {
        icon: Truck,
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
        label: "Dispatched",
        description: "Your order is on the way to your location.",
        progressColor: "bg-purple-500",
      },
      Delivered: {
        icon: CheckCircle,
        color: "text-green-400",
        bg: "bg-green-500/10",
        border: "border-green-500/20",
        label: "Delivered",
        description: "Your order has been successfully delivered.",
        progressColor: "bg-green-500",
      },
    };
    return configs[status] || configs.Pending;
  };

  const getStatusProgress = (status: OrderStatus): number => {
    const flow: OrderStatus[] = ["Pending", "Processed", "Dispatched", "Delivered"];
    const index = flow.indexOf(status);
    return ((index + 1) / flow.length) * 100;
  };

  const getOrderCounts = () => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "Pending").length,
      processed: orders.filter((o) => o.status === "Processed").length,
      dispatched: orders.filter((o) => o.status === "Dispatched").length,
      delivered: orders.filter((o) => o.status === "Delivered").length,
    };
  };

  const counts = getOrderCounts();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  };

  const verifyOrderOwnership = (order: Order): boolean => {
    if (user.role === "admin") return true;
    const userEmail = user.email.toLowerCase();
    return (
      order.user === user.id ||
      order.customerEmail?.toLowerCase() === userEmail
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b0f14] text-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            <p className="text-gray-400 mt-4">Loading your dashboard...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b0f14] to-[#131a24] text-white flex flex-col font-sans overflow-x-hidden">
      <Navbar />

      <section className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* ===== HEADER SECTION ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white truncate">
              Welcome back, <span className="text-orange-400">{user.fullName.split(" ")[0]}</span> 👋
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Manage your account, track orders, and view purchase history.
            </p>
            {user.role === "admin" && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full mt-2 border border-orange-500/20">
                <Shield size={14} /> Admin Access - Viewing All Orders
              </span>
            )}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium whitespace-nowrap"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 text-sm font-medium whitespace-nowrap"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        {/* ===== ALERTS ===== */}
        <div className="space-y-3 pt-4">
          {securityAlert && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-start gap-3">
              <Shield size={18} className="text-yellow-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-yellow-400 text-sm font-medium">{securityAlert}</p>
                <button
                  onClick={() => setSecurityAlert(null)}
                  className="text-yellow-400/70 text-xs font-medium underline mt-1 hover:text-yellow-300 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-red-400 text-sm font-medium">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="text-red-400/70 text-xs font-medium underline mt-1 hover:text-red-300 transition-colors"
                >
                  Try again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ===== INFO CARDS ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 shrink-0">
              <User size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Name</p>
              <p className="font-bold truncate text-sm">{user.fullName}</p>
            </div>
          </div>

          <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 shrink-0">
              <Mail size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</p>
              <p className="font-bold truncate text-sm font-mono">{user.email}</p>
            </div>
          </div>

          <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5">
            <div className="p-3 bg-green-500/10 rounded-xl text-green-400 shrink-0">
              <Eye size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Verified Orders</p>
              <p className="font-black text-2xl">{verifiedOrdersCount}</p>
            </div>
          </div>
        </div>

        {/* ===== ORDER SUMMARY STATS ===== */}
        {orders.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
            {counts.pending > 0 && (
              <div className="bg-[#111827] border border-orange-500/20 rounded-xl p-4 text-center hover:border-orange-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5">
                <p className="text-2xl font-black text-orange-400">{counts.pending}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Pending</p>
              </div>
            )}
            {counts.processed > 0 && (
              <div className="bg-[#111827] border border-blue-500/20 rounded-xl p-4 text-center hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5">
                <p className="text-2xl font-black text-blue-400">{counts.processed}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Processed</p>
              </div>
            )}
            {counts.dispatched > 0 && (
              <div className="bg-[#111827] border border-purple-500/20 rounded-xl p-4 text-center hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5">
                <p className="text-2xl font-black text-purple-400">{counts.dispatched}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Dispatched</p>
              </div>
            )}
            {counts.delivered > 0 && (
              <div className="bg-[#111827] border border-green-500/20 rounded-xl p-4 text-center hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5">
                <p className="text-2xl font-black text-green-400">{counts.delivered}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Delivered</p>
              </div>
            )}
          </div>
        )}

        {/* ===== ORDER HISTORY ===== */}
        <div className="pt-8">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
            <h2 className="text-lg font-bold flex items-center gap-2.5">
              <Package size={20} className="text-orange-500" />
              Order History
              {orders.length > 0 && (
                <span className="text-sm font-normal text-gray-400">
                  ({orders.length} {orders.length === 1 ? "order" : "orders"})
                </span>
              )}
            </h2>
            {orders.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-green-400 flex items-center gap-1.5 bg-green-500/10 px-2.5 py-1 rounded-full">
                  <Shield size={12} /> Verified
                </span>
                {lastUpdated && (
                  <span className="text-[10px] text-gray-500">
                    Updated {getTimeAgo(lastUpdated.toISOString())}
                  </span>
                )}
              </div>
            )}
          </div>

          {ordersLoading ? (
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent"></div>
              <p className="text-gray-400 mt-4 text-sm">Loading your orders...</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => {
                if (!verifyOrderOwnership(order) && user.role !== "admin") {
                  console.warn(`🚨 Security: Skipping order ${order._id} - does not belong to user`);
                  return null;
                }

                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;
                const progress = getStatusProgress(order.status);
                const isExpanded = expandedOrderId === order._id;

                return (
                  <div
                    key={order._id}
                    className="bg-[#111827] border border-white/10 rounded-2xl p-5 hover:border-orange-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Order Info */}
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[10px] sm:text-xs font-bold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20 flex items-center gap-1.5">
                            <Hash size={12} />
                            #{order._id.substring(order._id.length - 6).toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1.5">
                            <Calendar size={13} />
                            {formatDate(order.createdAt)}
                          </span>
                          <span
                            className={`text-[9px] sm:text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color}`}
                          >
                            {statusConfig.label}
                          </span>
                          {user.role === "admin" && order.user && (
                            <span className="text-[8px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                              User: {order.user.toString().slice(-6)}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-300 line-clamp-2">{order.itemsSummary}</p>

                        <div className="flex flex-wrap items-center gap-4 text-xs">
                          <span className="text-gray-400 flex items-center gap-1.5">
                            <Phone size={13} />
                            <span className="text-gray-200 font-mono">{order.phone}</span>
                          </span>
                          <span className="text-gray-400 flex items-center gap-1.5">
                            <CreditCard size={13} />
                            <span
                              className={`font-bold ${
                                order.paymentMethod === "M-Pesa"
                                  ? "text-green-400"
                                  : "text-blue-400"
                              }`}
                            >
                              {order.paymentMethod}
                            </span>
                          </span>
                          <span className="text-orange-400 font-black">
                            Ksh {order.total.toLocaleString()}
                          </span>
                          <button
                            onClick={() => toggleOrderExpansion(order._id)}
                            className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp size={14} /> Less
                              </>
                            ) : (
                              <>
                                <ChevronDown size={14} /> Details
                              </>
                            )}
                          </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full max-w-xs">
                          <div className="flex justify-between text-[8px] text-gray-500 mb-1 px-0.5">
                            <span>Pending</span>
                            <span>Processed</span>
                            <span>Dispatched</span>
                            <span>Delivered</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-700 ${statusConfig.progressColor}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Status Icon & Description */}
                      <div className="flex items-center gap-3 lg:flex-col lg:items-end shrink-0">
                        <div
                          className={`p-2.5 rounded-xl ${statusConfig.bg} border ${statusConfig.border}`}
                        >
                          <StatusIcon size={20} className={statusConfig.color} />
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-bold ${statusConfig.color}`}>
                            {statusConfig.label}
                          </p>
                          <p className="text-[10px] text-gray-500 hidden sm:block max-w-[160px]">
                            {statusConfig.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Order Details
                          </h4>
                          <div className="space-y-1.5 text-xs">
                            <p className="flex justify-between">
                              <span className="text-gray-400">Order ID:</span>
                              <span className="font-mono text-white">{order._id}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-gray-400">Customer:</span>
                              <span className="text-white">{order.customerName}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-gray-400">Email:</span>
                              <span className="text-white font-mono">{order.customerEmail}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-gray-400">Phone:</span>
                              <span className="text-white font-mono">{order.phone}</span>
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Payment & Status
                          </h4>
                          <div className="space-y-1.5 text-xs">
                            <p className="flex justify-between">
                              <span className="text-gray-400">Payment:</span>
                              <span
                                className={`font-bold ${
                                  order.paymentMethod === "M-Pesa"
                                    ? "text-green-400"
                                    : "text-blue-400"
                                }`}
                              >
                                {order.paymentMethod}
                              </span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-gray-400">Total:</span>
                              <span className="text-orange-400 font-black">
                                Ksh {order.total.toLocaleString()}
                              </span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-gray-400">Status:</span>
                              <span className={statusConfig.color}>{order.status}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-gray-400">Placed:</span>
                              <span className="text-gray-300">{formatDate(order.createdAt)}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Package size={32} className="text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Orders Yet</h3>
              <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
                You haven't placed any orders. Start shopping for quality spare parts now!
              </p>
              <a
                href="/shop"
                className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
              >
                Browse Spare Parts
              </a>
            </div>
          )}
        </div>

        {/* ===== QUICK ACTIONS ===== */}
       {/* ===== QUICK ACTIONS ===== */}
<div className="pt-8">
  <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
  
  {/* Fixed layout with consistent sizing */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* Action 1 - Browse Parts */}
    <a
      href="/shop"
      className="group relative bg-[#111827] border border-white/10 rounded-2xl p-5 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5 overflow-hidden min-h-[72px] flex items-center"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:via-orange-500/0 group-hover:to-orange-500/5 transition-all duration-500" />
      
      <div className="flex items-center justify-between w-full relative z-10">
        <span className="font-bold flex items-center gap-3 text-sm sm:text-base">
          <Settings size={18} className="text-orange-500 shrink-0" /> 
          <span className="truncate">Browse Parts</span>
        </span>
        <ArrowRight
          size={18}
          className="text-gray-600 group-hover:text-white transition-colors shrink-0 ml-4"
        />
      </div>
    </a>

    {/* Action 2 - Shop Again */}
    <a
      href="/shop"
      className="group relative bg-[#111827] border border-white/10 rounded-2xl p-5 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5 overflow-hidden min-h-[72px] flex items-center"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/0 to-green-500/0 group-hover:from-green-500/5 group-hover:via-green-500/0 group-hover:to-green-500/5 transition-all duration-500" />
      
      <div className="flex items-center justify-between w-full relative z-10">
        <span className="font-bold flex items-center gap-3 text-sm sm:text-base">
          <ShoppingBag size={18} className="text-green-500 shrink-0" /> 
          <span className="truncate">Shop Again</span>
        </span>
        <ArrowRight
          size={18}
          className="text-gray-600 group-hover:text-white transition-colors shrink-0 ml-4"
        />
      </div>
    </a>

    {/* Action 3 - Help & Support */}
    <a
      href="/about"
      className="group relative bg-[#111827] border border-white/10 rounded-2xl p-5 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 overflow-hidden min-h-[72px] flex items-center"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-blue-500/0 group-hover:to-blue-500/5 transition-all duration-500" />
      
      <div className="flex items-center justify-between w-full relative z-10">
        <span className="font-bold flex items-center gap-3 text-sm sm:text-base">
          <HelpCircle size={18} className="text-blue-500 shrink-0" /> 
          <span className="truncate">Help & Support</span>
        </span>
        <ArrowRight
          size={18}
          className="text-gray-600 group-hover:text-white transition-colors shrink-0 ml-4"
        />
      </div>
    </a>
  </div>
</div>
      </section>

      <Footer />
    </main>
  );
}