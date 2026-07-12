// import mongoose from "mongoose";

// interface MongooseCache {
//   conn: typeof mongoose | null;
//   promise: Promise<typeof mongoose> | null;
// }

// declare global {
//   // Matches the exact variable used in your connectDB utility
//   var mongooseCache: MongooseCache | undefined;
// }

// export {};



// types/index.ts
export type OrderStatus = "Pending" | "Processed" | "Dispatched" | "Delivered";

export interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
}

export interface Order {
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

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  createdAt: string;
  updatedAt: string;
}