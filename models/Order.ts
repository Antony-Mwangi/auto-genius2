// import mongoose, { Schema, model, models } from "mongoose";

// const OrderSchema = new Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },
//     customerName: {
//       type: String,
//       required: true,
//     },
//     customerEmail: {
//       type: String,
//       required: true,
//       trim: true,
//       lowercase: true,
//     },
//     phone: {
//       type: String,
//       required: true,
//     },
//     paymentMethod: {
//       type: String,
//       required: true,
//     },
//     itemsSummary: {
//       type: String,
//       required: true,
//     },
//     total: {
//       type: Number,
//       required: true,
//     },
//     status: {
//       type: String,
//       default: "Pending",
//     },

//     // Payment tracking
//     paymentStatus: {
//       type: String,
//       enum: ["unpaid", "pending", "paid", "failed"],
//       default: "unpaid",
//     },
//     mpesaReceipt: {
//       type: String,
//       default: null,
//     },
//     senderPhone: {
//       type: String,
//       default: null,
//     },
//     paymentDate: {
//       type: Date,
//       default: null,
//     },
//     kopoKopoReference: {
//       type: String,
//       default: null,
//     },
//   },
//   { timestamps: true }
// );

// export default models.Order || model("Order", OrderSchema);


// models/Order.ts

import mongoose, { Schema, model, models, Document, Model } from "mongoose";

/**
 * Order document interface.
 * Matches the schema fields exactly so TypeScript can validate
 * queries and updates across the codebase.
 */
export interface IOrder extends Document {
  user: mongoose.Types.ObjectId | null;
  customerName: string;
  customerEmail: string;
  phone: string;
  paymentMethod: string;
  itemsSummary: string;
  total: number;
  status: "Pending" | "Processed" | "Dispatched" | "Delivered";

  // Payment tracking
  paymentStatus: "unpaid" | "pending" | "paid" | "failed";
  mpesaReceipt: string | null;
  senderPhone: string | null;
  paymentDate: Date | null;
  kopoKopoReference: string | null;

  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["M-Pesa", "Cash on Delivery"],
    },
    itemsSummary: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Processed", "Dispatched", "Delivered"],
      default: "Pending",
      index: true,
    },

    // ===== Payment tracking =====
    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid", "failed"],
      default: "unpaid",
      index: true,
    },
    mpesaReceipt: {
      type: String,
      default: null,
    },
    senderPhone: {
      type: String,
      default: null,
    },
    paymentDate: {
      type: Date,
      default: null,
    },
    kopoKopoReference: {
      type: String,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    // Prevent schema recompilation issues during Next.js hot reload
    collection: "orders",
  }
);

// Compound index: quickly find pending M-Pesa orders awaiting callback
OrderSchema.index({ paymentStatus: 1, paymentMethod: 1 });

// Prevent Mongoose from caching an outdated model across hot reloads.
// In development, `models.Order` may hold a stale schema after edits.
const Order: Model<IOrder> =
  (models.Order as Model<IOrder>) || model<IOrder>("Order", OrderSchema);

export default Order;